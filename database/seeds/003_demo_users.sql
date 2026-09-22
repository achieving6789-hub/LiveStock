-- Demo User Accounts for All 7 Roles
-- Default test password for all demo accounts: DemoPass123!
-- Bcrypt cost 10 hash of 'DemoPass123!': $2a$10$Z1eO73.0v9GZ6B9mDsq1SuG557Q/l2pM6VvM0K8OQ36Z8K9xO7r56

INSERT INTO users (id, email, phone, full_name, password_hash, is_active, preferred_language, state_id, district_id, village_id) VALUES
    ('usr-farmer-01', 'farmer@livestock.gov', '+919876543210', 'Ramesh Kumar (Farmer)', '$2a$10$Z1eO73.0v9GZ6B9mDsq1SuG557Q/l2pM6VvM0K8OQ36Z8K9xO7r56', TRUE, 'en', 'state-tn-01', 'dist-salem-01', 'vil-kallanur-01'),
    ('usr-field-01', 'fieldworker@livestock.gov', '+919876543211', 'Anitha Selvam (Field Para-Vet)', '$2a$10$Z1eO73.0v9GZ6B9mDsq1SuG557Q/l2pM6VvM0K8OQ36Z8K9xO7r56', TRUE, 'ta', 'state-tn-01', 'dist-salem-01', 'vil-kallanur-01'),
    ('usr-vet-01', 'vet@livestock.gov', '+919876543212', 'Dr. Sundaramurthy B.V.Sc (Veterinary Surgeon)', '$2a$10$Z1eO73.0v9GZ6B9mDsq1SuG557Q/l2pM6VvM0K8OQ36Z8K9xO7r56', TRUE, 'en', 'state-tn-01', 'dist-salem-01', 'vil-kallanur-01'),
    ('usr-lab-01', 'lab@livestock.gov', '+919876543213', 'Dr. Priya Sharma (Senior Microbiologist)', '$2a$10$Z1eO73.0v9GZ6B9mDsq1SuG557Q/l2pM6VvM0K8OQ36Z8K9xO7r56', TRUE, 'en', 'state-tn-01', 'dist-salem-01', NULL),
    ('usr-district-01', 'district@livestock.gov', '+919876543214', 'Dr. K. Natarajan (District Animal Husbandry Officer)', '$2a$10$Z1eO73.0v9GZ6B9mDsq1SuG557Q/l2pM6VvM0K8OQ36Z8K9xO7r56', TRUE, 'en', 'state-tn-01', 'dist-salem-01', NULL),
    ('usr-state-01', 'state@livestock.gov', '+919876543215', 'Dr. V. Rajendran (State Epidemiologist)', '$2a$10$Z1eO73.0v9GZ6B9mDsq1SuG557Q/l2pM6VvM0K8OQ36Z8K9xO7r56', TRUE, 'en', 'state-tn-01', NULL, NULL),
    ('usr-super-01', 'admin@livestock.gov', '+919876543216', 'System Super Administrator', '$2a$10$Z1eO73.0v9GZ6B9mDsq1SuG557Q/l2pM6VvM0K8OQ36Z8K9xO7r56', TRUE, 'en', NULL, NULL, NULL)
ON CONFLICT (email) DO NOTHING;

INSERT INTO user_roles (user_id, role_id) VALUES
    ('usr-farmer-01', 'role-farmer-001'),
    ('usr-field-01', 'role-field-001'),
    ('usr-vet-01', 'role-vet-001'),
    ('usr-lab-01', 'role-lab-001'),
    ('usr-district-01', 'role-district-001'),
    ('usr-state-01', 'role-state-001'),
    ('usr-super-01', 'role-super-001')
ON CONFLICT (user_id, role_id) DO NOTHING;
