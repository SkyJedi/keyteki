describe('Evasion Sigil', function () {
    describe("Evasion Sigil's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    inPlay: ['dextre', 'batdrone', 'sanitation-engineer'],
                    discard: ['troll']
                },
                player2: {
                    inPlay: [
                        'evasion-sigil',
                        'sequis',
                        'niffle-ape',
                        'ancient-bear',
                        'briar-grubbling'
                    ]
                }
            });

            this.player1.moveCard(this.troll, 'deck');
        });

        it("should allow creatures to attack when the top card is a different house, and stop them when it's the same", function () {
            this.player1.fightWith(this.dextre, this.sequis);
            expect(this.troll.location).toBe('discard');
            expect(this.dextre.location).toBe('deck');
            expect(this.sequis.tokens.damage).toBe(1);
            this.player1.fightWith(this.batdrone, this.sequis);
            expect(this.dextre.location).toBe('discard');
            expect(this.batdrone.location).toBe('play area');
            expect(this.batdrone.exhausted).toBe(true);
            expect(this.sequis.tokens.damage).toBe(1);
        });

        it('should apply to both players', function () {
            this.player2.moveCard(this.ancientBear, 'deck');
            this.player1.endTurn();
            this.player2.clickPrompt('untamed');
            this.player2.fightWith(this.niffleApe, this.batdrone);
            expect(this.ancientBear.location).toBe('discard');
            expect(this.batdrone.location).toBe('play area');
            expect(this.batdrone.tokens.damage).toBeUndefined();
            expect(this.niffleApe.exhausted).toBe(true);
            expect(this.niffleApe.tokens.damage).toBeUndefined();
        });

        it('should prompt for active player when attacker has assault', function () {
            this.player2.moveCard(this.niffleApe, 'deck');
            this.player1.endTurn();
            this.player2.clickPrompt('untamed');
            this.player2.fightWith(this.ancientBear, this.dextre);
            expect(this.player2).toBeAbleToSelect(this.ancientBear);
            expect(this.player2).toBeAbleToSelect(this.evasionSigil);
            this.player2.clickCard(this.ancientBear);
            expect(this.niffleApe.location).toBe('discard');
            expect(this.ancientBear.location).toBe('play area');
            expect(this.dextre.location).toBe('play area');
            expect(this.dextre.tokens.damage).toBe(2);
            expect(this.ancientBear.exhausted).toBe(true);
            expect(this.ancientBear.tokens.damage).toBeUndefined();
        });

        it('should prompt for active player when defender has hazardous', function () {
            this.player2.moveCard(this.ancientBear, 'deck');
            this.player1.endTurn();
            this.player2.clickPrompt('untamed');
            this.player2.fightWith(this.niffleApe, this.sanitationEngineer);
            expect(this.player2).toBeAbleToSelect(this.sanitationEngineer);
            expect(this.player2).toBeAbleToSelect(this.evasionSigil);
            this.player2.clickCard(this.evasionSigil);
            expect(this.ancientBear.location).toBe('discard');
            expect(this.niffleApe.location).toBe('play area');
            expect(this.sanitationEngineer.location).toBe('play area');
            expect(this.sanitationEngineer.tokens.damage).toBeUndefined();
            expect(this.niffleApe.exhausted).toBe(true);
            expect(this.niffleApe.tokens.damage).toBeUndefined();
        });

        it('should prompt for active player when attacker has assault, defender has hazardous', function () {
            this.player2.moveCard(this.niffleApe, 'deck');
            this.player1.endTurn();
            this.player2.clickPrompt('untamed');
            this.player2.fightWith(this.ancientBear, this.sanitationEngineer);
            expect(this.player2).toBeAbleToSelect(this.ancientBear);
            expect(this.player2).toBeAbleToSelect(this.sanitationEngineer);
            expect(this.player2).toBeAbleToSelect(this.evasionSigil);
            this.player2.clickCard(this.ancientBear);
            expect(this.player2).not.toBeAbleToSelect(this.ancientBear);
            expect(this.player2).toBeAbleToSelect(this.sanitationEngineer);
            expect(this.player2).toBeAbleToSelect(this.evasionSigil);
            this.player2.clickCard(this.evasionSigil);
            expect(this.niffleApe.location).toBe('discard');
            expect(this.ancientBear.location).toBe('play area');
            expect(this.sanitationEngineer.location).toBe('play area');
            expect(this.sanitationEngineer.tokens.damage).toBe(2);
            expect(this.ancientBear.exhausted).toBe(true);
            expect(this.ancientBear.tokens.damage).toBeUndefined();
        });
    });
});
