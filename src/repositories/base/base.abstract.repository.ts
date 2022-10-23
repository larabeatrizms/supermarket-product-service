import { BaseInterfaceRepository } from './base.interface.repository';
import { DeleteResult, Repository } from 'typeorm';

export abstract class BaseAbstractRepository<T>
  implements BaseInterfaceRepository<T>
{
  private entity: Repository<T>;

  protected constructor(entity: Repository<T>) {
    this.entity = entity;
  }

  public async create(data: T): Promise<T> {
    const create = this.entity.create(data);

    return await this.entity.save(create);
  }

  public async createMany(data: T[]): Promise<T[]> {
    const creates = data.map((value) => this.entity.create(value));

    return await this.entity.save(creates);
  }

  public async update(data: T): Promise<T> {
    return await this.entity.save(data);
  }

  public async findOneById(id: number): Promise<T> {
    return await this.entity.findOneById(id);
  }

  public async findOneByCondition(
    filterCondition: any,
    order?: any,
  ): Promise<T> {
    return await this.entity.findOne({ where: filterCondition, order });
  }

  public async findOneWithRelations(relations: any): Promise<T> {
    return await this.entity.findOne(relations);
  }

  public async findWithRelations(relations: any): Promise<T[]> {
    return await this.entity.find(relations);
  }

  public async findAll(): Promise<T[]> {
    return await this.entity.find();
  }

  public async remove(id: string): Promise<DeleteResult> {
    return await this.entity.delete(id);
  }
}
