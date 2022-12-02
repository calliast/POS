CREATE OR REPLACE FUNCTION update_stockOnPurchase() RETURNS TRIGGER as $set_stockOnPurchaseItems$
    DECLARE
    old_stock INTEGER;
    total_price NUMERIC;
    current_invoice VARCHAR(20);

    BEGIN 
    -- update goods's stock when item added on purchase invoice
        IF (TG_OP = 'INSERT') THEN
            SELECT stock INTO old_stock FROM goods WHERE barcode = NEW.itemcode;
            UPDATE goods SET stock = old_stock + NEW.quantity WHERE barcode = NEW.itemcode;
            current_invoice = NEW.invoice;

    -- update goods's stock when item quantity updated on purchase invoice
        ELSIF (TG_OP = 'UPDATE') THEN
            SELECT stock INTO old_stock FROM goods WHERE barcode = NEW.itemcode;
            UPDATE goods SET stock = old_stock - OLD.quantity + NEW.quantity WHERE barcode = NEW.itemcode;
            current_invoice = NEW.invoice;

    -- update goods when item deleted from purchase invoice
        ELSIF (TG_OP = 'DELETE') THEN
            SELECT stock INTO old_stock FROM goods WHERE barcode = OLD.itemcode;
            UPDATE goods SET stock = old_stock - OLD.quantity WHERE barcode = OLD.itemcode;
            current_invoice = OLD.invoice;

        END IF;
    -- update purchases after endif condition
    SELECT coalesce(sum(totalprice),0) INTO total_price FROM purchaseitems WHERE invoice = current_invoice;
    UPDATE purchases SET totalsum = total_price WHERE invoice = current_invoice;

    RETURN NULL; -- result is ignored since this is an AFTER trigger
    END;
$set_stockOnPurchaseItems$ LANGUAGE plpgsql;

CREATE TRIGGER set_stockOnPurchaseItems
AFTER INSERT OR UPDATE OR DELETE on purchaseitems
    FOR EACH ROW EXECUTE FUNCTION update_stockOnPurchase();

-- update total price
CREATE OR REPLACE FUNCTION update_priceOnPurchase) RETURNS TRIGGER AS $set_totalPrice_onPurchase$
    DECLARE
        purchase_price NUMERIC;
    BEGIN
        SELECT purchaseprice INTO purchase_price FROM goods WHERE barcode = NEW.itemcode;
        NEW.purchaseprice := purchase_price;
        NEW.totalprice := NEW.quantity * purchase_price;
        RETURN NEW;
    END
$set_totalPrice_onPurchase$ LANGUAGE plpgsql;

CREATE TRIGGER set_totalPrice_onPurchase
BEFORE INSERT OR UPDATE ON purchaseitems
    FOR EACH ROW EXECUTE FUNCTION update_priceOnPurchase();