-- Script para adicionar colunas extras na tabela tb_user
-- Execute este script se as colunas não foram criadas automaticamente

-- Adicionar coluna store_name se não existir
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'tb_user' AND column_name = 'store_name') THEN
        ALTER TABLE tb_user ADD COLUMN store_name VARCHAR(255);
    END IF;
END $$;

-- Adicionar coluna profile_image se não existir
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'tb_user' AND column_name = 'profile_image') THEN
        ALTER TABLE tb_user ADD COLUMN profile_image VARCHAR(255);
    END IF;
END $$;

-- Adicionar coluna birth_date se não existir
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'tb_user' AND column_name = 'birth_date') THEN
        ALTER TABLE tb_user ADD COLUMN birth_date VARCHAR(50);
    END IF;
END $$;

-- Adicionar coluna address se não existir
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'tb_user' AND column_name = 'address') THEN
        ALTER TABLE tb_user ADD COLUMN address VARCHAR(255);
    END IF;
END $$;

-- Adicionar coluna city se não existir
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'tb_user' AND column_name = 'city') THEN
        ALTER TABLE tb_user ADD COLUMN city VARCHAR(100);
    END IF;
END $$;

-- Adicionar coluna state se não existir
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'tb_user' AND column_name = 'state') THEN
        ALTER TABLE tb_user ADD COLUMN state VARCHAR(2);
    END IF;
END $$;

-- Adicionar coluna zip_code se não existir
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'tb_user' AND column_name = 'zip_code') THEN
        ALTER TABLE tb_user ADD COLUMN zip_code VARCHAR(20);
    END IF;
END $$;

-- Verificar se as colunas foram criadas
SELECT 
    column_name, 
    data_type, 
    character_maximum_length
FROM information_schema.columns 
WHERE table_name = 'tb_user'
ORDER BY ordinal_position;
