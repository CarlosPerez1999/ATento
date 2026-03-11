import { Injectable, NotFoundException, Logger, InternalServerErrorException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';
import { Report } from './entities/report.entity';
import { UserRole, ReportStatus } from '@atento/shared';

@Injectable()
export class ReportsService {
  private readonly logger = new Logger(ReportsService.name);

  constructor(
    @InjectRepository(Report)
    private readonly reportRepository: Repository<Report>,
  ) {}

  async create(createReportDto: CreateReportDto, userId: string): Promise<Report> {
    try {
      const report = this.reportRepository.create({
        ...createReportDto,
        userId,
      });
      return await this.reportRepository.save(report);
    } catch (error) {
      this.logger.error(`Error creating report: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Could not create report');
    }
  }

  async findAll(): Promise<Report[]> {
    return await this.reportRepository.find({
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
  }

  async findMyReports(userId: string): Promise<Report[]> {
    return await this.reportRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Report> {
    const report = await this.reportRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!report) {
      throw new NotFoundException(`Report with ID ${id} not found`);
    }

    return report;
  }

  async update(id: string, updateReportDto: UpdateReportDto, userId: string, userRole: UserRole): Promise<Report> {
    const report = await this.findOne(id);

    // Only Admin can update status
    if (updateReportDto.status && userRole !== UserRole.ADMIN) {
      throw new ForbiddenException('Only administrators can update report status');
    }

    // Only owner or admin can update other fields
    if (report.userId !== userId && userRole !== UserRole.ADMIN) {
      throw new ForbiddenException('You do not have permission to update this report');
    }

    Object.assign(report, updateReportDto);
    return await this.reportRepository.save(report);
  }

  async remove(id: string, userId: string, userRole: UserRole): Promise<void> {
    const report = await this.findOne(id);

    if (report.userId !== userId && userRole !== UserRole.ADMIN) {
      throw new ForbiddenException('You do not have permission to delete this report');
    }

    await this.reportRepository.remove(report);
  }
}
