import { IsInt, IsOptional, IsString, Length, Matches, Min } from 'class-validator';

export class CrearUsuarioDto {
  // Se guarda en UsuarioDesc
  @IsString()
  @Length(3, 30)
  @Matches(/^[A-Za-z0-9._-]+$/, { message: 'usuario solo admite letras, números, punto, guion y guion bajo' })
  usuario: string;

  // bcrypt solo usa los primeros 72 bytes
  @IsString()
  @Length(8, 72)
  password: string;

  // Se crea un registro en NombrePersonal
  @IsString()
  @Length(2, 150)
  nombre: string;

  @IsInt()
  @Min(1)
  rolId: number;

  @IsInt()
  @Min(1)
  permisoId: number;

  // Si no se envía, se toma Rol.RolPaginaHomeId
  @IsOptional()
  @IsInt()
  @Min(1)
  paginaHomeId?: number;

  // Si no se envía, se toma Rol.RolPermisosId
  @IsOptional()
  @IsInt()
  @Min(1)
  permisosPaginasId?: number;
}
