import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { PasswordModule } from 'primeng/password';
import { SelectModule } from 'primeng/select';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';
import { IRegisterDto, EstadoMx, Pais, VALIDATION } from '@atento/shared';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    InputTextModule,
    ButtonModule,
    RippleModule,
    PasswordModule,
    SelectModule
  ],
  templateUrl: './register.component.html'
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private notificationService = inject(NotificationService);
  public router = inject(Router);

  isSubmitting = signal(false);

  // Enum Options for PrimeNG Select
  paises = [{ label: 'México', value: Pais.MEXICO }];
  estados = Object.values(EstadoMx).map(estado => ({ label: estado, value: estado }));

  registerForm = this.fb.group({
    firstName: ['', [Validators.required, Validators.minLength(2)]],
    lastName: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.pattern(VALIDATION.PASSWORD_REGEX)]],
    address: this.fb.group({
      calle: ['', Validators.required],
      numExt: ['', Validators.required],
      numInt: [''],
      // Regex limitando a 5 números para el CP
      codigoPostal: ['', [Validators.required, Validators.pattern(/^[0-9]{5}$/)]],
      municipio: ['', Validators.required],
      estado: [null as EstadoMx | null, Validators.required],
      pais: [Pais.MEXICO, Validators.required]
    })
  });

  register() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      this.notificationService.warn('Por favor corrige los errores del formulario antes de continuar.');
      return;
    }

    this.isSubmitting.set(true);

    const formValue = this.registerForm.value;
    const dto: IRegisterDto = {
      email: formValue.email!,
      password: formValue.password!,
      firstName: formValue.firstName!,
      lastName: formValue.lastName!,
      address: {
        calle: formValue.address!.calle!,
        numExt: formValue.address!.numExt!,
        numInt: formValue.address!.numInt || '',
        codigoPostal: formValue.address!.codigoPostal!,
        municipio: formValue.address!.municipio!,
        estado: formValue.address!.estado!,
        pais: formValue.address!.pais!
      }
    };

    this.authService.register(dto).subscribe({
      next: () => {
        this.isSubmitting.set(false);
        this.notificationService.success('Registro exitoso.');
      },
      error: (err) => {
        this.isSubmitting.set(false);
        const errorMsg = Array.isArray(err.error?.message) 
          ? err.error.message[0] 
          : (err.error?.message || 'Revisa los datos ingresados e intenta de nuevo.');
        this.notificationService.error(errorMsg, 'Error de registro');
        console.error(err);
      }
    });
  }
}
