import Court from '@domain/entities/court.js';
import CourtsRepository from '@repository/courts.repository.js';

/**
 * Courts service
 */
export default class CourtsService {
  /**
   * Courts repository used for service to get data from storage
   */
  private readonly courtsRepository: CourtsRepository;

  /**
   * Constructor for the CourtsService
   */
  constructor(courtsRepository: CourtsRepository) {
    this.courtsRepository = courtsRepository;
  }

  /**
   * Get all courts
   */
  public async getAllCourts(): Promise<Court[]> {
    return await this.courtsRepository.getAllCourts();
  }
}
