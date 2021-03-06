describe("Rakuzel's Chant", function () {
    describe('if the tide is neutral', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'unfathomable',
                    amber: 1,
                    inPlay: ['giltspine-netcaster', 'flaxia'],
                    hand: ['rakuzel-s-chant']
                },
                player2: {
                    amber: 4,
                    inPlay: ['gub', 'krump']
                }
            });
        });

        it('should exhaust a creature', function () {
            this.player1.play(this.rakuzelSChant);

            expect(this.player1).toBeAbleToSelect(this.giltspineNetcaster);
            expect(this.player1).toBeAbleToSelect(this.flaxia);
            expect(this.player1).toBeAbleToSelect(this.gub);
            expect(this.player1).toBeAbleToSelect(this.krump);

            this.player1.clickCard(this.krump);
            expect(this.giltspineNetcaster.exhausted).toBe(false);
            expect(this.flaxia.exhausted).toBe(false);
            expect(this.gub.exhausted).toBe(false);
            expect(this.krump.exhausted).toBe(true);
        });

        describe('if the tide is low', function () {
            beforeEach(function () {
                this.player1.lowerTide();
            });

            it('should exhaust a creature', function () {
                this.player1.play(this.rakuzelSChant);

                expect(this.player1).toBeAbleToSelect(this.giltspineNetcaster);
                expect(this.player1).toBeAbleToSelect(this.flaxia);
                expect(this.player1).toBeAbleToSelect(this.gub);
                expect(this.player1).toBeAbleToSelect(this.krump);

                this.player1.clickCard(this.krump);
                expect(this.giltspineNetcaster.exhausted).toBe(false);
                expect(this.flaxia.exhausted).toBe(false);
                expect(this.gub.exhausted).toBe(false);
                expect(this.krump.exhausted).toBe(true);
            });
        });

        describe('if the tide is high', function () {
            beforeEach(function () {
                this.player1.raiseTide();
            });

            it('should exhaust all creatures', function () {
                this.player1.play(this.rakuzelSChant);
                expect(this.giltspineNetcaster.exhausted).toBe(true);
                expect(this.flaxia.exhausted).toBe(true);
                expect(this.gub.exhausted).toBe(true);
                expect(this.krump.exhausted).toBe(true);
                expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
            });
        });
    });
});
