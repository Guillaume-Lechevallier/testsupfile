-- un peu d'cleaning en cascade histoire d'être tranquille
DROP TABLE IF EXISTS "InternalShare" CASCADE;
DROP TABLE IF EXISTS "Share" CASCADE;
DROP TABLE IF EXISTS "FileItem" CASCADE;
DROP TABLE IF EXISTS "User" CASCADE;


CREATE TABLE "User" (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255),
    quota_limit_bytes BIGINT NOT NULL DEFAULT 32212254720, -- 30 Go
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE "FileItem" (
    id SERIAL PRIMARY KEY,
    owner_id INTEGER NOT NULL REFERENCES "User" (id) ON DELETE CASCADE, 
    parent_id INTEGER REFERENCES "FileItem" (id) ON DELETE CASCADE, 
    name VARCHAR(255) NOT NULL,
    is_folder BOOLEAN NOT NULL DEFAULT FALSE,
    physical_path VARCHAR(255), 
    size_bytes BIGINT NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP DEFAULT NULL
);

CREATE INDEX idx_fileitem_parent ON "FileItem" (parent_id);
CREATE INDEX idx_fileitem_name_owner ON "FileItem" (owner_id, name);


CREATE TABLE "Share" (
    id SERIAL PRIMARY KEY,
    file_item_id INTEGER NOT NULL REFERENCES "FileItem" (id) ON DELETE CASCADE,
    unique_url_token VARCHAR(36) UNIQUE NOT NULL, 
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE "InternalShare" (
    id SERIAL PRIMARY KEY,
    folder_id INTEGER NOT NULL REFERENCES "FileItem" (id) ON DELETE CASCADE,
    shared_with_user_id INTEGER NOT NULL REFERENCES "User" (id) ON DELETE CASCADE,
    UNIQUE (folder_id, shared_with_user_id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

