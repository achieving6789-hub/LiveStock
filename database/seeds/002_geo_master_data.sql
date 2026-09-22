-- Master Geographic and Species Data for Testing
INSERT INTO states (id, name, code) VALUES
    ('state-tn-01', 'Tamil Nadu', 'TN'),
    ('state-mh-01', 'Maharashtra', 'MH')
ON CONFLICT (code) DO NOTHING;

INSERT INTO districts (id, state_id, name, code) VALUES
    ('dist-salem-01', 'state-tn-01', 'Salem', 'TN-SLM'),
    ('dist-erode-01', 'state-tn-01', 'Erode', 'TN-ERD'),
    ('dist-pune-01', 'state-mh-01', 'Pune', 'MH-PUN')
ON CONFLICT (state_id, code) DO NOTHING;

INSERT INTO blocks (id, district_id, name, code) VALUES
    ('block-attur-01', 'dist-salem-01', 'Attur', 'SLM-ATT'),
    ('block-omlur-01', 'dist-salem-01', 'Omalur', 'SLM-OML'),
    ('block-bhavani-01', 'dist-erode-01', 'Bhavani', 'ERD-BHV')
ON CONFLICT DO NOTHING;

INSERT INTO villages (id, block_id, name, code, latitude, longitude) VALUES
    ('vil-kallanur-01', 'block-attur-01', 'Kallanur', 'VIL-001', 11.5985, 78.5991),
    ('vil-mallur-01', 'block-attur-01', 'Mallur', 'VIL-002', 11.5432, 78.1812),
    ('vil-taramangalam-01', 'block-omlur-01', 'Tharamangalam', 'VIL-003', 11.6974, 77.9782),
    ('vil-anthiyur-01', 'block-bhavani-01', 'Anthiyur', 'VIL-004', 11.5794, 77.5857)
ON CONFLICT DO NOTHING;

INSERT INTO species (id, name, scientific_name, is_livestock) VALUES
    ('sp-bovine-01', 'Cattle', 'Bos taurus / Bos indicus', TRUE),
    ('sp-buffalo-01', 'Buffalo', 'Bubalus bubalis', TRUE),
    ('sp-caprine-01', 'Goat', 'Capra hircus', TRUE),
    ('sp-ovine-01', 'Sheep', 'Ovis aries', TRUE),
    ('sp-poultry-01', 'Poultry', 'Gallus gallus domesticus', TRUE)
ON CONFLICT (name) DO NOTHING;

INSERT INTO symptoms (id, code, name, category, weight_score) VALUES
    ('sym-01', 'FEVER', 'High Pyrexia (Fever > 104 F)', 'systemic', 1.8),
    ('sym-02', 'VESICLES_MOUTH', 'Vesicular Blisters on Mouth / Tongue', 'mucosal', 2.5),
    ('sym-03', 'VESICLES_FEET', 'Foot Lesions / Severe Lameness', 'mucosal', 2.5),
    ('sym-04', 'SALIVATION', 'Excessive Frothy Salivation', 'digestive', 2.0),
    ('sym-05', 'SKIN_NODULES', 'Circumscribed Skin Nodules (LSD-like)', 'systemic', 2.8),
    ('sym-06', 'RESPIRATORY_DISTRESS', 'Dyspnea / Labored Grunting Respiration', 'respiratory', 2.2),
    ('sym-07', 'SUDDEN_DEATH', 'Acute Mortality without Premonitory Signs', 'systemic', 3.0),
    ('sym-08', 'MILK_DROP', 'Sudden Dramatic Lactation Drop', 'systemic', 1.5)
ON CONFLICT (code) DO NOTHING;

INSERT INTO disease_master (id, name, scientific_name, code, severity, is_zoonotic, requires_quarantine, description) VALUES
    ('dis-fmd-01', 'Foot-and-Mouth Disease (FMD)', 'Aphthovirus', 'FMD', 'HIGH', FALSE, TRUE, 'Highly contagious viral disease of cloven-hoofed animals characterized by fever and vesicles.'),
    ('dis-lsd-01', 'Lumpy Skin Disease (LSD)', 'Capripoxvirus', 'LSD', 'HIGH', FALSE, TRUE, 'Poxvirus disease of cattle characterized by fever, enlarged lymph nodes and multiple cutaneous nodules.'),
    ('dis-anthrax-01', 'Anthrax', 'Bacillus anthracis', 'ANTHRAX', 'CRITICAL', TRUE, TRUE, 'Peracute infectious bacterial zoonosis with acute death and hemorrhage.'),
    ('dis-ppr-01', 'Peste des Petits Ruminants (PPR)', 'Small ruminant morbillivirus', 'PPR', 'HIGH', FALSE, TRUE, 'Highly contagious viral disease affecting domestic and wild small ruminants.')
ON CONFLICT (name) DO NOTHING;
