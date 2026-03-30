-- Add new fields to complaints table for enhanced form
ALTER TABLE complaints 
ADD COLUMN IF NOT EXISTS phone_number VARCHAR(50),
ADD COLUMN IF NOT EXISTS district VARCHAR(100),
ADD COLUMN IF NOT EXISTS sector VARCHAR(100),
ADD COLUMN IF NOT EXISTS cell VARCHAR(100),
ADD COLUMN IF NOT EXISTS village VARCHAR(100),
ADD COLUMN IF NOT EXISTS incident_date DATE,
ADD COLUMN IF NOT EXISTS urgency_level VARCHAR(20) DEFAULT 'normal' CHECK (urgency_level IN ('normal', 'urgent', 'fatal')),
ADD COLUMN IF NOT EXISTS gps_coordinates TEXT,
ADD COLUMN IF NOT EXISTS preferred_contact_method VARCHAR(20) DEFAULT 'email' CHECK (preferred_contact_method IN ('email', 'phone', 'both'));

-- Update existing complaints to have default values for new fields
UPDATE complaints 
SET 
    phone_number = NULL,
    district = NULL,
    sector = NULL,
    cell = NULL,
    village = NULL,
    incident_date = created_at::date,
    urgency_level = 'normal',
    gps_coordinates = NULL,
    preferred_contact_method = 'email'
WHERE phone_number IS NULL;

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_complaints_urgency ON complaints(urgency_level);
CREATE INDEX IF NOT EXISTS idx_complaints_incident_date ON complaints(incident_date);
CREATE INDEX IF NOT EXISTS idx_complaints_location_details ON complaints(district, sector, cell, village);
