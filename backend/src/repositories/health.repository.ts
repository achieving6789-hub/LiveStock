import { dbService } from '../config/db.js';
import type { RiskLevel } from '../models/types.js';

export interface Animal {
  id: string;
  ownerId: string;
  tagNumber: string;
  species: string;
  breed?: string;
  ageMonths: number;
  gender: 'MALE' | 'FEMALE' | 'UNKNOWN';
  villageId: string;
  isActive: boolean;
  createdAt: string;
}

export interface HealthReport {
  id: string;
  reporterId: string;
  animalId?: string;
  species: string;
  breed?: string;
  symptoms: string[];
  severity: 'MILD' | 'MODERATE' | 'SEVERE' | 'CRITICAL';
  durationDays: number;
  temperatureC?: number;
  milkYieldDropPct?: number;
  appetiteLoss: boolean;
  activityReduced: boolean;
  visibleClinicalSigns?: string;
  mortalityFlag: boolean;
  latitude: number;
  longitude: number;
  description?: string;
  photoUrls?: string[];
  source: string;
  syncStatus: string;
  assessedRisk: {
    ruleScore: number;
    riskLevel: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
    factors: string[];
  };
  createdAt: string;
}

export interface MortalityReport {
  id: string;
  reporterId: string;
  animalId?: string;
  species: string;
  numberOfDeaths: number;
  suspectedCause: string;
  dateOfDeath: string;
  latitude: number;
  longitude: number;
  villageId?: string;
  createdAt: string;
}

// In-Memory Seeded Health Data Store
export class HealthRepository {
  public static animals: Map<string, Animal> = new Map([
    [
      'anim-01',
      {
        id: 'anim-01',
        ownerId: 'usr-farmer-01',
        tagNumber: 'IN-TN-9821',
        species: 'Cattle',
        breed: 'Kangayam',
        ageMonths: 36,
        gender: 'FEMALE',
        villageId: 'vil-kallanur-01',
        isActive: true,
        createdAt: '2025-06-10T10:00:00Z',
      },
    ],
    [
      'anim-02',
      {
        id: 'anim-02',
        ownerId: 'usr-farmer-01',
        tagNumber: 'IN-TN-9824',
        species: 'Cattle',
        breed: 'Jersey Cross',
        ageMonths: 14,
        gender: 'FEMALE',
        villageId: 'vil-kallanur-01',
        isActive: true,
        createdAt: '2026-01-15T10:00:00Z',
      },
    ],
    [
      'anim-03',
      {
        id: 'anim-03',
        ownerId: 'usr-farmer-01',
        tagNumber: 'IN-TN-4310',
        species: 'Buffalo',
        breed: 'Murrah',
        ageMonths: 48,
        gender: 'FEMALE',
        villageId: 'vil-kallanur-01',
        isActive: true,
        createdAt: '2025-03-20T10:00:00Z',
      },
    ],
    [
      'anim-04',
      {
        id: 'anim-04',
        ownerId: 'usr-farmer-01',
        tagNumber: 'IN-TN-6701',
        species: 'Goat',
        breed: 'Tellicherry',
        ageMonths: 18,
        gender: 'FEMALE',
        villageId: 'vil-kallanur-01',
        isActive: true,
        createdAt: '2025-11-05T10:00:00Z',
      },
    ],
  ]);

  public static reports: Map<string, HealthReport> = new Map([
    [
      'rep-001',
      {
        id: 'rep-001',
        reporterId: 'usr-farmer-01',
        animalId: 'anim-01',
        species: 'Cattle',
        breed: 'Kangayam',
        symptoms: ['FEVER', 'VESICLES_MOUTH', 'SALIVATION'],
        severity: 'SEVERE',
        durationDays: 2,
        temperatureC: 40.2,
        milkYieldDropPct: 45,
        appetiteLoss: true,
        activityReduced: true,
        visibleClinicalSigns: 'Epithelial erosions on dental pad, frothy stringy saliva',
        mortalityFlag: false,
        latitude: 11.5985,
        longitude: 78.5991,
        description: 'Cow stopped feeding yesterday, heavy salivation and high body temperature.',
        source: 'MOBILE',
        syncStatus: 'SYNCED',
        assessedRisk: {
          ruleScore: 68,
          riskLevel: 'HIGH',
          factors: ['rapid_pyrexia', 'vesicular_signs', 'milk_production_collapse'],
        },
        createdAt: new Date(Date.now() - 7200000).toISOString(),
      },
    ],
  ]);

  public static mortality: Map<string, MortalityReport> = new Map([
    [
      'mort-001',
      {
        id: 'mort-001',
        reporterId: 'usr-farmer-01',
        animalId: 'anim-04',
        species: 'Goat',
        numberOfDeaths: 1,
        suspectedCause: 'Acute respiratory distress and bloat',
        dateOfDeath: new Date().toISOString().split('T')[0],
        latitude: 11.5985,
        longitude: 78.5991,
        villageId: 'vil-kallanur-01',
        createdAt: new Date(Date.now() - 86400000).toISOString(),
      },
    ],
  ]);

  public static getAnimalsByOwner(ownerId: string): Animal[] {
    return Array.from(this.animals.values()).filter((a) => a.ownerId === ownerId);
  }

  public static getAllAnimals(): Animal[] {
    return Array.from(this.animals.values());
  }

  public static createAnimal(data: Omit<Animal, 'id' | 'createdAt'>): Animal {
    const id = `anim-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const animal: Animal = {
      ...data,
      id,
      createdAt: new Date().toISOString(),
    };
    this.animals.set(id, animal);
    return animal;
  }

  public static getReports(): HealthReport[] {
    return Array.from(this.reports.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  public static createReport(data: Omit<HealthReport, 'id' | 'createdAt' | 'assessedRisk'>): HealthReport {
    const id = `rep-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;

    // Calculate Dynamic Risk Score via Hybrid Rule Engine
    let score = 20;
    const factors: string[] = [];

    if (data.mortalityFlag) {
      score += 35;
      factors.push('mortality_flag_triggered');
    }
    if (data.severity === 'CRITICAL') {
      score += 30;
      factors.push('critical_clinical_severity');
    } else if (data.severity === 'SEVERE') {
      score += 20;
      factors.push('severe_clinical_symptoms');
    }

    if (data.symptoms.includes('VESICLES_MOUTH') || data.symptoms.includes('VESICLES_FEET')) {
      score += 25;
      factors.push('vesicular_lesion_contagion_profile');
    }
    if (data.symptoms.includes('SUDDEN_DEATH')) {
      score += 30;
      factors.push('acute_peracute_death_signal');
    }
    if ((data.milkYieldDropPct || 0) > 40) {
      score += 15;
      factors.push('severe_lactation_drop');
    }
    if ((data.temperatureC || 0) > 39.5) {
      score += 15;
      factors.push('hyperthermia_pyrexia');
    }

    score = Math.min(Math.max(score, 10), 99);

    let riskLevel: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL' = 'LOW';
    if (score >= 75) riskLevel = 'CRITICAL';
    else if (score >= 50) riskLevel = 'HIGH';
    else if (score >= 25) riskLevel = 'MODERATE';

    const report: HealthReport = {
      ...data,
      id,
      assessedRisk: {
        ruleScore: score,
        riskLevel,
        factors,
      },
      createdAt: new Date().toISOString(),
    };

    this.reports.set(id, report);
    return report;
  }

  public static getMortalityReports(): MortalityReport[] {
    return Array.from(this.mortality.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  public static createMortalityReport(
    data: Omit<MortalityReport, 'id' | 'createdAt'>
  ): MortalityReport {
    const id = `mort-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const report: MortalityReport = {
      ...data,
      id,
      createdAt: new Date().toISOString(),
    };
    this.mortality.set(id, report);
    return report;
  }
}
