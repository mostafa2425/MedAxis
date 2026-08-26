import { patientRepo } from '../repositories/patient.repo';
import { NotFoundError } from '../utils/errors';

class PatientService {
  async getAll(params: {
    page: number;
    limit: number;
    search?: string;
    gender?: 'MALE' | 'FEMALE';
    surgicalProcedureId?: string;
    createdBy: string;
  }) {
    return patientRepo.findAll(params);
  }

  async getById(id: string, createdBy: string) {
    const patient = await patientRepo.findById(id, createdBy);
    if (!patient) throw new NotFoundError('Patient');
    return patient;
  }

  async create(
    data: {
      fullName: string;
      age: number;
      gender?: 'MALE' | 'FEMALE';
      mobile?: string;
      notes?: string;
    },
    createdBy: string,
  ) {
    return patientRepo.create({ ...data, createdBy });
  }

  async update(
    id: string,
    createdBy: string,
    data: {
      fullName?: string;
      age?: number;
      gender?: 'MALE' | 'FEMALE';
      mobile?: string;
      notes?: string;
    },
  ) {
    await this.getById(id, createdBy);
    return patientRepo.update(id, createdBy, data);
  }

  async delete(id: string, createdBy: string) {
    await this.getById(id, createdBy);
    return patientRepo.delete(id, createdBy);
  }

  async getRecent(createdBy: string, limit = 5) {
    return patientRepo.findRecent(createdBy, limit);
  }
}

export const patientService = new PatientService();
