const Card = require('../../Card.js');

class AmberVac extends Card {
    // (T) Play: Raise the tide.
    // (T) This creature gains, "At the start of your turn, if the tide is high, capture 2A."
    setupCardAbilities(ability) {
        this.interrupt({
            when: {
                onBeginRound: (_, context) =>
                    context.player === context.game.activePlayer &&
                    context.source.parent &&
                    context.source.parent.controller.isTideHigh()
            },
            gameAction: ability.actions.capture((context) => ({
                target: context.source.parent,
                amount: 2
            }))
        });

        this.play({
            gameAction: ability.actions.raiseTide()
        });
    }
}

AmberVac.id = 'æmber-vac';

module.exports = AmberVac;
