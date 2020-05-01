-- Table: public."StandaloneDeckCards"

-- DROP TABLE public."StandaloneDeckCards";

CREATE TABLE public."StandaloneDeckCards"
(
    "Id" integer NOT NULL GENERATED BY DEFAULT AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
    "CardId" text COLLATE pg_catalog."default",
    "Count" integer NOT NULL,
    "Maverick" text COLLATE pg_catalog."default",
    "Anomaly" text COLLATE pg_catalog."default",
    "Enhancements" text COLLATE pg_catalog."default",
    "DeckId" integer NOT NULL,
    CONSTRAINT "PK_StandaloneDeckCards" PRIMARY KEY ("Id"),
    CONSTRAINT "FK_StandaloneDeckCards_StandaloneDecks_DeckId" FOREIGN KEY ("DeckId")
        REFERENCES public."StandaloneDecks" ("Id") MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
)

TABLESPACE pg_default;

ALTER TABLE public."StandaloneDeckCards"
    OWNER to keyteki;
-- Index: IX_StandaloneDeckCards_DeckId

-- DROP INDEX public."IX_StandaloneDeckCards_DeckId";

CREATE INDEX "IX_StandaloneDeckCards_DeckId"
    ON public."StandaloneDeckCards" USING btree
    ("DeckId" ASC NULLS LAST)
    TABLESPACE pg_default;