
CREATE TYPE roleType AS ENUM ('SuperAdmin', 'Admin', 'Subscriber') DEFAULT 'Subscriber';

CREATE TABLE users(
    user_id uuid DEFAULT uuid_generate_v4 () PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL,
    middle_name VARCHAR(255),
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone_number BIGINT NOT NULL,
    role roleType,
    address VARCHAR(255) NOT NULL,
    created_date VARCHAR(255)
);

