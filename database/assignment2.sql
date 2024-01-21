-- Query 1
INSERT INTO account (account_firstname, account_lastname, account_email, account_password)
VALUES ('Tony', 'Stark', 'tony@starkent.com', 'Iam1ronM@n');

-- Query 2
UPDATE account
SET account_type = 'Admin'
WHERE account_id = 1;

-- Query 3
DELETE FROM account WHERE account_id = 1;

-- Query 4
UPDATE inventory
SET inv_description = replace(inv_description, 'small interiors', 'a huge interior')
WHERE inv_id = 10;
-- WHERE invMake="GM" AND invModel="Hummer";

-- Query 5
SELECT inv_make, inv_model, classification_name
FROM inventory
    JOIN classification
    ON inventory.classification_id = classification.classification_id
WHERE inventory.classification_id = 2;
-- WHERE classification_name = 'Sport';

-- Query 6
UPDATE inventory
SET inv_image = replace(inv_image, '/images/', '/images/vehicles/'),
    inv_thumbnail = replace(inv_thumbnail, '/images/', '/images/vehicles/');
