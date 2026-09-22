-- ====================================================================
-- AI-Enabled Livestock Health Early-Warning & Surveillance Platform
-- Migration: 001_initial_schema.sql
-- Compatible with PostgreSQL 14+ and PostGIS 3+
-- ====================================================================

-- 1. Enable PostGIS Extension (if available)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- 2. Enumerations
DO $$ BEGIN
    CREATE TYPE user_role_type AS ENUM (
        'FARMER',
        'FIELD_WORKER',
        'VETERINARIAN',
        'LAB_STAFF',
        'DISTRICT_OFFICER',
        'STATE_ADMIN',
        'SUPER_ADMIN'
    );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE sync_status_type AS ENUM ('PENDING', 'SYNCING', 'SYNCED', 'FAILED');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE report_source_type AS ENUM ('MOBILE', 'OFFLINE', 'IVR', 'FIELD_WORKER', 'VETERINARIAN', 'LAB', 'IOT');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE severity_level_type AS ENUM ('MILD', 'MODERATE', 'SEVERE', 'CRITICAL');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE risk_level_type AS ENUM ('LOW', 'MODERATE', 'HIGH', 'CRITICAL');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE alert_status_type AS ENUM ('NEW', 'ACKNOWLEDGED', 'ASSIGNED', 'INVESTIGATING', 'RESOLVED');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE investigation_status_type AS ENUM ('PENDING', 'IN_PROGRESS', 'SAMPLE_REQUESTED', 'AWAITING_LAB', 'RESOLVED', 'CLOSED');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE sample_status_type AS ENUM (
        'REQUESTED',
        'COLLECTED',
        'DISPATCHED',
        'RECEIVED',
        'TESTING',
        'RESULT_AVAILABLE',
        'VALIDATED',
        'REJECTED'
    );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- 3. Geo-Hierarchy & Locations
CREATE TABLE IF NOT EXISTS states (
    id VARCHAR(36) PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL UNIQUE,
    code VARCHAR(10) NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS districts (
    id VARCHAR(36) PRIMARY KEY DEFAULT uuid_generate_v4(),
    state_id VARCHAR(36) NOT NULL REFERENCES states(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(20) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_district_state_code UNIQUE (state_id, code)
);

CREATE TABLE IF NOT EXISTS blocks (
    id VARCHAR(36) PRIMARY KEY DEFAULT uuid_generate_v4(),
    district_id VARCHAR(36) NOT NULL REFERENCES districts(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(20) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS villages (
    id VARCHAR(36) PRIMARY KEY DEFAULT uuid_generate_v4(),
    block_id VARCHAR(36) NOT NULL REFERENCES blocks(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(20) NOT NULL,
    latitude NUMERIC(10, 7) NOT NULL,
    longitude NUMERIC(10, 7) NOT NULL,
    geom geometry(Point, 4326),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. RBAC & Users
CREATE TABLE IF NOT EXISTS roles (
    id VARCHAR(36) PRIMARY KEY DEFAULT uuid_generate_v4(),
    name user_role_type NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS permissions (
    id VARCHAR(36) PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS role_permissions (
    role_id VARCHAR(36) NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    permission_id VARCHAR(36) NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
    PRIMARY KEY (role_id, permission_id)
);

CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(36) PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(30) UNIQUE,
    full_name VARCHAR(150) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    preferred_language VARCHAR(5) NOT NULL DEFAULT 'en', -- en, ta, mr, hi
    state_id VARCHAR(36) REFERENCES states(id) ON DELETE SET NULL,
    district_id VARCHAR(36) REFERENCES districts(id) ON DELETE SET NULL,
    village_id VARCHAR(36) REFERENCES villages(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS user_roles (
    user_id VARCHAR(36) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role_id VARCHAR(36) NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, role_id)
);

CREATE TABLE IF NOT EXISTS refresh_tokens (
    id VARCHAR(36) PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id VARCHAR(36) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash VARCHAR(255) NOT NULL UNIQUE,
    revoked BOOLEAN NOT NULL DEFAULT FALSE,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Species, Breeds, Owners, Herds, Animals
CREATE TABLE IF NOT EXISTS species (
    id VARCHAR(36) PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL UNIQUE,
    scientific_name VARCHAR(150),
    is_livestock BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS breeds (
    id VARCHAR(36) PRIMARY KEY DEFAULT uuid_generate_v4(),
    species_id VARCHAR(36) NOT NULL REFERENCES species(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    origin_region VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS owners (
    id VARCHAR(36) PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id VARCHAR(36) REFERENCES users(id) ON DELETE SET NULL,
    full_name VARCHAR(150) NOT NULL,
    phone VARCHAR(30) NOT NULL,
    village_id VARCHAR(36) REFERENCES villages(id) ON DELETE SET NULL,
    address TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS herds (
    id VARCHAR(36) PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_id VARCHAR(36) NOT NULL REFERENCES owners(id) ON DELETE CASCADE,
    species_id VARCHAR(36) NOT NULL REFERENCES species(id) ON DELETE RESTRICT,
    herd_name VARCHAR(100) NOT NULL,
    head_count INT NOT NULL DEFAULT 1,
    village_id VARCHAR(36) REFERENCES villages(id) ON DELETE SET NULL,
    latitude NUMERIC(10, 7),
    longitude NUMERIC(10, 7),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS animals (
    id VARCHAR(36) PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_id VARCHAR(36) NOT NULL REFERENCES owners(id) ON DELETE CASCADE,
    herd_id VARCHAR(36) REFERENCES herds(id) ON DELETE SET NULL,
    tag_number VARCHAR(50) UNIQUE,
    species_id VARCHAR(36) NOT NULL REFERENCES species(id) ON DELETE RESTRICT,
    breed_id VARCHAR(36) REFERENCES breeds(id) ON DELETE SET NULL,
    age_months INT,
    gender VARCHAR(10) CHECK (gender IN ('MALE', 'FEMALE', 'UNKNOWN')),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    village_id VARCHAR(36) REFERENCES villages(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. Disease Master & Symptoms
CREATE TABLE IF NOT EXISTS symptoms (
    id VARCHAR(36) PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL, -- respiratory, digestive, systemic, mucosal, neurological
    weight_score NUMERIC(5, 2) NOT NULL DEFAULT 1.0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS disease_master (
    id VARCHAR(36) PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(150) NOT NULL UNIQUE,
    scientific_name VARCHAR(200),
    code VARCHAR(50) UNIQUE,
    severity severity_level_type NOT NULL DEFAULT 'MODERATE',
    is_zoonotic BOOLEAN NOT NULL DEFAULT FALSE,
    incubation_period_days INT,
    requires_quarantine BOOLEAN NOT NULL DEFAULT FALSE,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. Health Reports & Mortality
CREATE TABLE IF NOT EXISTS health_reports (
    id VARCHAR(36) PRIMARY KEY DEFAULT uuid_generate_v4(),
    local_id VARCHAR(100), -- For offline mobile synchronization
    idempotency_key VARCHAR(100) UNIQUE,
    reporter_id VARCHAR(36) REFERENCES users(id) ON DELETE SET NULL,
    animal_id VARCHAR(36) REFERENCES animals(id) ON DELETE SET NULL,
    herd_id VARCHAR(36) REFERENCES herds(id) ON DELETE SET NULL,
    species_id VARCHAR(36) REFERENCES species(id) ON DELETE SET NULL,
    village_id VARCHAR(36) REFERENCES villages(id) ON DELETE SET NULL,
    source report_source_type NOT NULL DEFAULT 'MOBILE',
    sync_status sync_status_type NOT NULL DEFAULT 'SYNCED',
    severity severity_level_type NOT NULL DEFAULT 'MILD',
    duration_days INT DEFAULT 1,
    temperature_c NUMERIC(4, 1),
    milk_yield_drop_pct NUMERIC(5, 2),
    appetite_loss BOOLEAN DEFAULT FALSE,
    activity_reduced BOOLEAN DEFAULT FALSE,
    visible_clinical_signs TEXT,
    mortality_flag BOOLEAN DEFAULT FALSE,
    latitude NUMERIC(10, 7) NOT NULL,
    longitude NUMERIC(10, 7) NOT NULL,
    geom geometry(Point, 4326),
    description TEXT,
    photo_urls JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS health_report_symptoms (
    report_id VARCHAR(36) NOT NULL REFERENCES health_reports(id) ON DELETE CASCADE,
    symptom_id VARCHAR(36) NOT NULL REFERENCES symptoms(id) ON DELETE CASCADE,
    observed_severity severity_level_type DEFAULT 'MILD',
    PRIMARY KEY (report_id, symptom_id)
);

CREATE TABLE IF NOT EXISTS mortality_reports (
    id VARCHAR(36) PRIMARY KEY DEFAULT uuid_generate_v4(),
    report_id VARCHAR(36) REFERENCES health_reports(id) ON DELETE SET NULL,
    animal_id VARCHAR(36) REFERENCES animals(id) ON DELETE SET NULL,
    herd_id VARCHAR(36) REFERENCES herds(id) ON DELETE SET NULL,
    species_id VARCHAR(36) NOT NULL REFERENCES species(id) ON DELETE RESTRICT,
    village_id VARCHAR(36) REFERENCES villages(id) ON DELETE SET NULL,
    number_of_deaths INT NOT NULL DEFAULT 1,
    suspected_cause TEXT,
    confirmed_disease_id VARCHAR(36) REFERENCES disease_master(id) ON DELETE SET NULL,
    is_laboratory_confirmed BOOLEAN NOT NULL DEFAULT FALSE,
    date_of_death DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. Risk Assessment, Alerts & Clusters
CREATE TABLE IF NOT EXISTS risk_scores (
    id VARCHAR(36) PRIMARY KEY DEFAULT uuid_generate_v4(),
    report_id VARCHAR(36) NOT NULL REFERENCES health_reports(id) ON DELETE CASCADE,
    rule_score NUMERIC(5, 2) NOT NULL, -- 0 to 100
    ml_probability NUMERIC(5, 4),      -- 0.0000 to 1.0000
    combined_score NUMERIC(5, 2) NOT NULL,
    risk_level risk_level_type NOT NULL,
    factors JSONB NOT NULL DEFAULT '[]'::jsonb,
    model_version VARCHAR(50) DEFAULT 'rule-v1',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS risk_alerts (
    id VARCHAR(36) PRIMARY KEY DEFAULT uuid_generate_v4(),
    risk_score_id VARCHAR(36) REFERENCES risk_scores(id) ON DELETE SET NULL,
    report_id VARCHAR(36) REFERENCES health_reports(id) ON DELETE CASCADE,
    village_id VARCHAR(36) REFERENCES villages(id) ON DELETE SET NULL,
    risk_level risk_level_type NOT NULL,
    priority INT NOT NULL DEFAULT 3, -- 1=Urgent, 2=High, 3=Normal, 4=Low
    title VARCHAR(200) NOT NULL,
    description TEXT,
    risk_factors JSONB NOT NULL DEFAULT '[]'::jsonb,
    recommended_action TEXT NOT NULL,
    assigned_vet_id VARCHAR(36) REFERENCES users(id) ON DELETE SET NULL,
    status alert_status_type NOT NULL DEFAULT 'NEW',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP WITH TIME ZONE
);

CREATE TABLE IF NOT EXISTS clusters (
    id VARCHAR(36) PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(150) NOT NULL,
    species_id VARCHAR(36) REFERENCES species(id) ON DELETE SET NULL,
    disease_id VARCHAR(36) REFERENCES disease_master(id) ON DELETE SET NULL,
    center_latitude NUMERIC(10, 7) NOT NULL,
    center_longitude NUMERIC(10, 7) NOT NULL,
    centroid_geom geometry(Point, 4326),
    radius_meters NUMERIC(10, 2) NOT NULL DEFAULT 5000.0,
    case_count INT NOT NULL DEFAULT 1,
    affected_animals INT NOT NULL DEFAULT 1,
    mortality_count INT NOT NULL DEFAULT 0,
    risk_level risk_level_type NOT NULL DEFAULT 'HIGH',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    time_window_start TIMESTAMP WITH TIME ZONE NOT NULL,
    time_window_end TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS cluster_members (
    cluster_id VARCHAR(36) NOT NULL REFERENCES clusters(id) ON DELETE CASCADE,
    report_id VARCHAR(36) NOT NULL REFERENCES health_reports(id) ON DELETE CASCADE,
    distance_meters NUMERIC(10, 2),
    PRIMARY KEY (cluster_id, report_id)
);

-- 9. Investigations & Laboratory Workflow
CREATE TABLE IF NOT EXISTS investigations (
    id VARCHAR(36) PRIMARY KEY DEFAULT uuid_generate_v4(),
    alert_id VARCHAR(36) REFERENCES risk_alerts(id) ON DELETE SET NULL,
    report_id VARCHAR(36) REFERENCES health_reports(id) ON DELETE CASCADE,
    assigned_vet_id VARCHAR(36) NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    status investigation_status_type NOT NULL DEFAULT 'PENDING',
    priority INT NOT NULL DEFAULT 2,
    clinical_findings TEXT,
    tentative_diagnosis_id VARCHAR(36) REFERENCES disease_master(id) ON DELETE SET NULL,
    containment_measures TEXT,
    started_at TIMESTAMP WITH TIME ZONE,
    closed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS laboratory_samples (
    id VARCHAR(36) PRIMARY KEY DEFAULT uuid_generate_v4(),
    sample_code VARCHAR(50) NOT NULL UNIQUE,
    investigation_id VARCHAR(36) NOT NULL REFERENCES investigations(id) ON DELETE CASCADE,
    animal_id VARCHAR(36) REFERENCES animals(id) ON DELETE SET NULL,
    sample_type VARCHAR(100) NOT NULL, -- Blood, Nasal Swab, Tissue, Milk, Serum
    transport_condition VARCHAR(100),   -- Cold chain 2-8C, Dry ice, Ambient
    status sample_status_type NOT NULL DEFAULT 'REQUESTED',
    collected_by_id VARCHAR(36) REFERENCES users(id) ON DELETE SET NULL,
    collection_date TIMESTAMP WITH TIME ZONE,
    received_at_lab TIMESTAMP WITH TIME ZONE,
    destination_lab_name VARCHAR(150),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS laboratory_results (
    id VARCHAR(36) PRIMARY KEY DEFAULT uuid_generate_v4(),
    sample_id VARCHAR(36) NOT NULL REFERENCES laboratory_samples(id) ON DELETE CASCADE,
    test_type VARCHAR(100) NOT NULL, -- RT-PCR, ELISA, Culture, Microscopy
    detected_disease_id VARCHAR(36) REFERENCES disease_master(id) ON DELETE SET NULL,
    result_value VARCHAR(100) NOT NULL, -- POSITIVE, NEGATIVE, INCONCLUSIVE
    quantitative_metric VARCHAR(100),
    tested_by_id VARCHAR(36) NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    validated_by_id VARCHAR(36) REFERENCES users(id) ON DELETE SET NULL,
    validation_status VARCHAR(50) NOT NULL DEFAULT 'PENDING_VALIDATION',
    test_timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    notes TEXT
);

CREATE TABLE IF NOT EXISTS model_feedback (
    id VARCHAR(36) PRIMARY KEY DEFAULT uuid_generate_v4(),
    risk_score_id VARCHAR(36) REFERENCES risk_scores(id) ON DELETE CASCADE,
    lab_result_id VARCHAR(36) REFERENCES laboratory_results(id) ON DELETE CASCADE,
    initial_predicted_risk risk_level_type NOT NULL,
    actual_diagnosis_confirmed BOOLEAN NOT NULL,
    is_false_positive BOOLEAN NOT NULL DEFAULT FALSE,
    is_false_negative BOOLEAN NOT NULL DEFAULT FALSE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 10. Audit Logging
CREATE TABLE IF NOT EXISTS audit_logs (
    id VARCHAR(36) PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id VARCHAR(36) REFERENCES users(id) ON DELETE SET NULL,
    user_email VARCHAR(255),
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(100) NOT NULL,
    resource_id VARCHAR(100),
    ip_address VARCHAR(50),
    user_agent TEXT,
    before_state JSONB,
    after_state JSONB,
    status_code INT DEFAULT 200,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 11. Spatial & Query Optimization Indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_reports_geom ON health_reports USING GIST(geom);
CREATE INDEX IF NOT EXISTS idx_reports_created ON health_reports(created_at);
CREATE INDEX IF NOT EXISTS idx_reports_village ON health_reports(village_id);
CREATE INDEX IF NOT EXISTS idx_alerts_risk_priority ON risk_alerts(risk_level, priority);
CREATE INDEX IF NOT EXISTS idx_clusters_centroid ON clusters USING GIST(centroid_geom);
CREATE INDEX IF NOT EXISTS idx_audit_created ON audit_logs(created_at);
