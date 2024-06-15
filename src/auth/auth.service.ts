import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto, RegisiterUserDto,UpdateAuthDto, LoginDto } from './dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './entities/user.entity';
import { Model } from 'mongoose';
import * as bcryptjs from 'bcryptjs'
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './entities/jwt-payload';
import { LoginResponse } from './entities/login-response';
import {  } from './dto';

@Injectable()
export class AuthService {

constructor(
   @InjectModel(User.name) private userModel: Model<User>,
   private jwtService : JwtService,
  ){}

  async create(createUserDto: CreateUserDto): Promise<User> {


   
   // 2. Guardar el Usuario
   // 3. Generar el JWT


   try{

    // 1. Encriptar la contrasena

    const { password , ...userData } = createUserDto;

    const newUser = new this.userModel({
      password : bcryptjs.hashSync(password, 10),
      ...userData

    });


    await newUser.save();

    const {password:_ , ...user} = newUser.toJSON();
    return user;
    
   }catch(error){
     if (error.code === 11000){
      throw new BadRequestException(`${ createUserDto.email} ya Existe`);
     }else{
      throw new InternalServerErrorException('Problemas en el Servidor')
     }
   }

    
  }


  async login(loginDto : LoginDto): Promise<LoginResponse>{
    /**
     * User 
     * Token -- SADADD
     */

    const {email, password} = loginDto;
    const user = await this.userModel.findOne({email : email})
    if (!user) throw new UnauthorizedException('Credenciales invalidas - email');

    if (!bcryptjs.compareSync(password,  user.password)){
      throw new UnauthorizedException('Credenciales invalidas - password');
    }

    const {password:_, ...rest} = user.toJSON();



    return {
      user: rest,
      token: this.getJwToken({id: user.id})
    }


  }

  async register(registerDto: RegisiterUserDto): Promise<LoginResponse>{

    const user = await this.create(registerDto);

    return {
      user : user,
      token : this.getJwToken({id: user._id})
    }

  }

  findAll(): Promise<User[]> {
    return  this.userModel.find();
  }


  async findUserById(id: string){
    const user = await this.userModel.findById(id);
    const { password, ...rest} = user.toJSON();
    return rest;

  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }


  getJwToken(payload: JwtPayload){
    const token = this.jwtService.sign(payload);
    return token;
  }

}
