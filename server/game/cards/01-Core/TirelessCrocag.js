const Card = require('../../Card.js');

class TirelessCrocag extends Card {
    setupCardAbilities(ability) {
        this.persistentEffect({
            effect: [
                ability.effects.cardCannot('reap'),
                ability.effects.terminalCondition({
                    condition: (context) =>
                        !context.player.opponent ||
                        context.player.opponent.creaturesInPlay.length === 0,
                    message: '{0} is destroyed as there are no opposing creatures',
                    gameAction: ability.actions.destroy()
                })
            ]
        });

        this.persistentEffect({
            effect: ability.effects.canUse((card) => card === this)
        });
    }
}

TirelessCrocag.id = 'tireless-crocag';

module.exports = TirelessCrocag;
