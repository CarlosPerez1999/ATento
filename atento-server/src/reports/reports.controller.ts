import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ReportsService } from './reports.service';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '@atento/shared';
import * as Express from 'express';

@ApiTags('reports')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new citizen report' })
  @ApiResponse({ status: 201, description: 'Report created successfully' })
  create(@Body() createReportDto: CreateReportDto, @Req() req: Express.Request) {
    const userId = req.user?.['id'];
    return this.reportsService.create(createReportDto, userId);
  }

  @Get()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get all reports (Admin only)' })
  findAll() {
    return this.reportsService.findAll();
  }

  @Get('my-reports')
  @ApiOperation({ summary: 'Get reports created by the current user' })
  findMyReports(@Req() req: Express.Request) {
    const userId = req.user?.['id'];
    return this.reportsService.findMyReports(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get report details by ID' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.reportsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a report' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateReportDto: UpdateReportDto,
    @Req() req: Express.Request,
  ) {
    const userId = req.user?.['id'];
    const userRole = req.user?.['role'] as UserRole;
    return this.reportsService.update(id, updateReportDto, userId, userRole);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a report' })
  remove(@Param('id', ParseUUIDPipe) id: string, @Req() req: Express.Request) {
    const userId = req.user?.['id'];
    const userRole = req.user?.['role'] as UserRole;
    return this.reportsService.remove(id, userId, userRole);
  }
}
