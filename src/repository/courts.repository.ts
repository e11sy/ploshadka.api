import Court from '@domain/entities/court.js';
import CourtsStorage from '@repository/storage/courts.storage.js';

export default class CourtsRepository {
  private readonly courtsStorage: CourtsStorage;

  constructor(courtsStorage: CourtsStorage) {
    this.courtsStorage = courtsStorage;
  }

  public async getAllCourts(): Promise<Court[]> {
    return await this.courtsStorage.getAllCourts();
  }
}
