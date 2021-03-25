import { getRepository, Repository } from 'typeorm';

import { User } from '../../../users/entities/User';
import { Game } from '../../entities/Game';

import { IGamesRepository } from '../IGamesRepository';

export class GamesRepository implements IGamesRepository {
  private repository: Repository<Game>;

  constructor() {
    this.repository = getRepository(Game);
  }

  async findByTitleContaining(param: string): Promise<Game[]> {
    return this.repository
      .createQueryBuilder('games')
      .where('LOWER(title) LIKE LOWER(:title)', { title: `%${param}%` })
      .getMany();
  }

  async countAllGames(): Promise<[{ count: string }]> {
    return this.repository.query('SELECT COUNT(id) as count FROM games');
  }

  async findUsersByGameId(id: string): Promise<User[]> {
    const usersRepository = getRepository(User);
    
    return usersRepository
      .createQueryBuilder('users')
      .leftJoinAndSelect('users.games', 'games')
      .where('games.id = :id', { id })
      .getMany();
  }
}
