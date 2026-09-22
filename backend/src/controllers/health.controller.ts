import type { Request, Response, NextFunction } from 'express';
import { HealthRepository } from '../repositories/health.repository.js';
import { AppError } from '../middleware/errorHandler.js';

export class HealthController {
  public static async getAnimals(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const ownerId = req.user?.id;
      // If user is a farmer, filter by their own animals, else return all
      const isFarmer = req.user?.roles.includes('FARMER') && !req.user?.roles.includes('SUPER_ADMIN');
      const animals = isFarmer && ownerId
        ? HealthRepository.getAnimalsByOwner(ownerId)
        : HealthRepository.getAllAnimals();

      res.status(200).json({
        success: true,
        data: { animals },
      });
    } catch (error) {
      next(error);
    }
  }

  public static async createAnimal(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { tagNumber, species, breed, ageMonths, gender, villageId } = req.body;

      if (!tagNumber || !species) {
        throw new AppError('Tag number and species are required', 400, 'VALIDATION_ERROR');
      }

      const animal = HealthRepository.createAnimal({
        ownerId: req.user?.id || 'usr-farmer-01',
        tagNumber,
        species,
        breed,
        ageMonths: Number(ageMonths) || 12,
        gender: gender || 'FEMALE',
        villageId: villageId || 'vil-kallanur-01',
        isActive: true,
      });

      res.status(201).json({
        success: true,
        message: 'Animal registered successfully',
        data: { animal },
      });
    } catch (error) {
      next(error);
    }
  }

  public static async getHealthReports(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const reports = HealthRepository.getReports();
      res.status(200).json({
        success: true,
        data: { reports },
      });
    } catch (error) {
      next(error);
    }
  }

  public static async createHealthReport(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const {
        animalId,
        species,
        breed,
        symptoms,
        severity,
        durationDays,
        temperatureC,
        milkYieldDropPct,
        appetiteLoss,
        activityReduced,
        visibleClinicalSigns,
        mortalityFlag,
        latitude,
        longitude,
        description,
        source,
      } = req.body;

      if (!species || !symptoms || symptoms.length === 0) {
        throw new AppError('Species and at least one symptom are required', 400, 'VALIDATION_ERROR');
      }

      const report = HealthRepository.createReport({
        reporterId: req.user?.id || 'usr-farmer-01',
        animalId,
        species,
        breed,
        symptoms,
        severity: severity || 'MILD',
        durationDays: Number(durationDays) || 1,
        temperatureC: temperatureC ? Number(temperatureC) : undefined,
        milkYieldDropPct: milkYieldDropPct ? Number(milkYieldDropPct) : undefined,
        appetiteLoss: Boolean(appetiteLoss),
        activityReduced: Boolean(activityReduced),
        visibleClinicalSigns,
        mortalityFlag: Boolean(mortalityFlag),
        latitude: Number(latitude) || 11.5985,
        longitude: Number(longitude) || 78.5991,
        description,
        source: source || 'MOBILE',
        syncStatus: 'SYNCED',
      });

      res.status(201).json({
        success: true,
        message: 'Health issue report submitted and assessed by early-warning engine',
        data: { report },
      });
    } catch (error) {
      next(error);
    }
  }

  public static async getMortalityReports(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const reports = HealthRepository.getMortalityReports();
      res.status(200).json({
        success: true,
        data: { reports },
      });
    } catch (error) {
      next(error);
    }
  }

  public static async createMortalityReport(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { species, numberOfDeaths, suspectedCause, dateOfDeath, latitude, longitude, animalId } = req.body;

      if (!species || !numberOfDeaths) {
        throw new AppError('Species and number of deaths are required', 400, 'VALIDATION_ERROR');
      }

      const report = HealthRepository.createMortalityReport({
        reporterId: req.user?.id || 'usr-farmer-01',
        animalId,
        species,
        numberOfDeaths: Number(numberOfDeaths),
        suspectedCause: suspectedCause || 'Acute mortality without specific premonitory signs',
        dateOfDeath: dateOfDeath || new Date().toISOString().split('T')[0],
        latitude: Number(latitude) || 11.5985,
        longitude: Number(longitude) || 78.5991,
        villageId: 'vil-kallanur-01',
      });

      res.status(201).json({
        success: true,
        message: 'Mortality report registered and flagged for veterinary autopsy review',
        data: { report },
      });
    } catch (error) {
      next(error);
    }
  }

  public static async getAnimalTimeline(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const animal = Array.from(HealthRepository.animals.values()).find((a) => a.id === id);

      if (!animal) {
        throw new AppError('Animal not found', 404, 'NOT_FOUND');
      }

      const timeline = [
        {
          id: 'tl-1',
          type: 'REGISTRATION',
          title: `Registered: Tag #${animal.tagNumber}`,
          date: animal.createdAt,
          description: `${animal.breed || animal.species} registered to livestock holdings in Kallanur village.`,
          status: 'COMPLETED',
        },
        {
          id: 'tl-2',
          type: 'VACCINATION',
          title: 'FMD Prophylactic Vaccination',
          date: '2025-09-14T09:00:00Z',
          description: 'Foot-and-Mouth Disease Bivalent oil-adjuvanted vaccine batch #FMD-2025-TN administered.',
          status: 'COMPLETED',
        },
        {
          id: 'tl-3',
          type: 'HEALTH_REPORT',
          title: 'Acute Vesicular Symptoms Reported',
          date: new Date(Date.now() - 7200000).toISOString(),
          description: 'High pyrexia (104.2 F), mouth blisters, and excessive salivation logged.',
          status: 'HIGH_RISK',
        },
        {
          id: 'tl-4',
          type: 'INVESTIGATION',
          title: 'Veterinary Clinical Investigation Initiated',
          date: new Date(Date.now() - 3600000).toISOString(),
          description: 'Dr. Sundaramurthy assigned. Oral mucosal inspection and quarantine advised.',
          status: 'IN_PROGRESS',
        },
        {
          id: 'tl-5',
          type: 'LABORATORY',
          title: 'Diagnostic Sample Collected (Vesicular Epithelium)',
          date: new Date(Date.now() - 1800000).toISOString(),
          description: 'Sample SMP-2026-0042 dispatched to RADDL under cold chain condition.',
          status: 'TESTING',
        },
      ];

      res.status(200).json({
        success: true,
        data: {
          animal,
          timeline,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}
