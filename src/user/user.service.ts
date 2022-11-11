import { Injectable } from '@nestjs/common';
import { UserRepository } from 'src/repository/user.repository';
import { Connection } from 'typeorm';

@Injectable()
export class UserService {
  private userRepository: UserRepository;
  constructor(private readonly connection: Connection) {
    this.userRepository = this.connection.getCustomRepository(UserRepository);
  }

  async findOne(login_id: string) {
    return this.userRepository.findByLogin(login_id);
  }
}
