-- Seed Roles and Permissions
INSERT INTO roles (id, name, description) VALUES
    ('role-farmer-001', 'FARMER', 'Individual livestock owner / herd keeper'),
    ('role-field-001', 'FIELD_WORKER', 'Grassroots para-veterinary worker / field enumerator'),
    ('role-vet-001', 'VETERINARIAN', 'Clinical veterinarian with diagnostic and investigation duties'),
    ('role-lab-001', 'LAB_STAFF', 'Diagnostic laboratory officer / pathologist'),
    ('role-district-001', 'DISTRICT_OFFICER', 'District veterinary administrative officer'),
    ('role-state-001', 'STATE_ADMIN', 'State-level epidemiological surveillance administrator'),
    ('role-super-001', 'SUPER_ADMIN', 'Platform super-administrator with full audit and master control')
ON CONFLICT (name) DO NOTHING;

INSERT INTO permissions (id, code, description) VALUES
    ('perm-001', 'HEALTH_REPORT_CREATE', 'Create initial animal health reports'),
    ('perm-002', 'HEALTH_REPORT_READ_OWN', 'View own submitted health reports'),
    ('perm-003', 'HEALTH_REPORT_READ_ALL', 'View all regional or state health reports'),
    ('perm-004', 'VET_INVESTIGATION_START', 'Initiate on-field veterinary investigations'),
    ('perm-005', 'VET_INVESTIGATION_MANAGE', 'Update clinical findings and close investigations'),
    ('perm-006', 'LAB_SAMPLE_REQUEST', 'Request lab diagnostic samples'),
    ('perm-007', 'LAB_SAMPLE_PROCESS', 'Receive, test, and enter laboratory results'),
    ('perm-008', 'LAB_RESULT_VALIDATE', 'Formally validate and certify lab test findings'),
    ('perm-009', 'SURVEILLANCE_DISTRICT_VIEW', 'View district surveillance aggregations and maps'),
    ('perm-010', 'SURVEILLANCE_STATE_VIEW', 'View state-wide analytics, heatmaps and clusters'),
    ('perm-011', 'ADMIN_USER_MANAGE', 'Provision users, modify roles and assign scopes'),
    ('perm-012', 'ADMIN_AUDIT_VIEW', 'Access immutable system security audit logs')
ON CONFLICT (code) DO NOTHING;
