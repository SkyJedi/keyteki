const CardGameAction = require('./CardGameAction');

class DealDamageAction extends CardGameAction {
    setDefaultProperties() {
        this.amount = null;
        this.amountForCard = () => 1;
        this.fightEvent = null;
        this.damageSource = null;
        this.damageType = 'card effect';
        this.splash = 0;
        this.purge = false;
        this.ignoreArmor = false;
        this.bonus = false;
    }

    setup() {
        this.targetType = ['creature'];
        this.name = 'damage';
        this.effectMsg =
            'deal ' +
            (this.amount ? this.amount + ' ' : '') +
            'damage to {0}' +
            (this.splash ? ' and ' + this.splash + ' to their neighbors' : '');
    }

    canAffect(card, context) {
        if (this.amount === 0 || (!this.amount && this.amountForCard(card, context) === 0)) {
            return false;
        }

        return card.location === 'play area' && super.canAffect(card, context);
    }

    getEventArray(context) {
        if (this.splash) {
            return this.target
                .filter((card) => this.canAffect(card, context))
                .reduce(
                    (array, card) =>
                        array.concat(
                            this.getEvent(card, context),
                            card.neighbors.map((neighbor) =>
                                this.getEvent(neighbor, context, this.splash)
                            )
                        ),
                    []
                );
        }

        return super.getEventArray(context);
    }

    getDamageSource(card, context) {
        if (this.damageSource) {
            return typeof this.damageSource === 'function'
                ? this.damageSource(card, context)
                : this.damageSource;
        } else {
            return context.source;
        }
    }

    getEvent(card, context, amount = this.amount || this.amountForCard(card, context)) {
        const params = {
            card: card,
            context: context,
            amount: amount,
            damageSource: this.getDamageSource(card, context),
            damageType: this.damageType,
            destroyEvent: null,
            fightEvent: this.fightEvent,
            ignoreArmor: this.ignoreArmor,
            bonus: this.bonus
        };

        return super.createEvent('onDamageDealt', params, (damageDealtEvent) => {
            if (damageDealtEvent.card.warded) {
                for (let event of damageDealtEvent
                    .getSimultaneousEvents()
                    .filter(
                        (event) =>
                            event.name === 'onDamageDealt' && event.card === damageDealtEvent.card
                    )) {
                    event.cancel();
                }

                let sourceArg;

                if (
                    damageDealtEvent.damageSource &&
                    damageDealtEvent.damageSource.name === 'Framework effect'
                ) {
                    sourceArg = 'a bonus icon';
                } else {
                    sourceArg = damageDealtEvent.damageSource;
                }

                context.game.addMessage(
                    "{0}'s ward token prevents the damage dealt by {1} and is discarded",
                    damageDealtEvent.card,
                    sourceArg
                );
                damageDealtEvent.card.unward();
                return;
            }

            let damageAppliedParams = {
                amount: damageDealtEvent.amount,
                card: damageDealtEvent.card,
                context: damageDealtEvent.context,
                condition: (event) => event.amount > 0
            };
            let damageAppliedEvent = super.createEvent(
                'onDamageApplied',
                damageAppliedParams,
                (event) => {
                    event.noGameStateCheck = true;
                    event.card.addToken('damage', event.amount);
                    if (
                        !event.card.moribund &&
                        (event.card.tokens.damage >= event.card.power ||
                            (damageDealtEvent.fightEvent &&
                                damageDealtEvent.damageSource &&
                                damageDealtEvent.damageSource.getKeywordValue('poison')))
                    ) {
                        if (this.purge) {
                            damageDealtEvent.destroyEvent = context.game.actions
                                .purge({ damageEvent: damageDealtEvent })
                                .getEvent(event.card, context.game.getFrameworkContext());
                        } else {
                            damageDealtEvent.destroyEvent = context.game.actions
                                .destroy({ damageEvent: damageDealtEvent })
                                .getEvent(event.card, context.game.getFrameworkContext());
                        }

                        event.addSubEvent(damageDealtEvent.destroyEvent);
                        if (damageDealtEvent.fightEvent) {
                            damageDealtEvent.fightEvent.destroyed.push(event.card);
                        }
                    }
                }
            );

            let armorEvent;
            if (
                damageDealtEvent.ignoreArmor ||
                damageDealtEvent.card.armor <= damageDealtEvent.card.armorUsed
            ) {
                armorEvent = super.createEvent(
                    'unnamedEvent',
                    { card: damageDealtEvent.card, context: damageDealtEvent.context },
                    () => {
                        damageDealtEvent.addSubEvent(damageAppliedEvent);
                    }
                );
            } else {
                let armorPreventParams = {
                    card: damageDealtEvent.card,
                    context: damageDealtEvent.context,
                    amount: damageDealtEvent.amount,
                    noGameStateCheck: true
                };
                armorEvent = super.createEvent(
                    'onDamagePreventedByArmor',
                    armorPreventParams,
                    (event) => {
                        const currentArmor = event.card.armor - event.card.armorUsed;
                        if (event.amount <= currentArmor) {
                            card.armorUsed += event.amount;
                            event.damagePrevented = event.amount;
                        } else {
                            card.armorUsed += currentArmor;
                            event.damagePrevented = currentArmor;
                        }

                        damageAppliedEvent.amount -= event.damagePrevented;
                        damageDealtEvent.amount -= event.damagePrevented;
                        damageDealtEvent.addSubEvent(damageAppliedEvent);
                    }
                );
            }
            damageDealtEvent.addSubEvent(armorEvent);
            armorEvent.openReactionWindow = true;
        });
    }
}

module.exports = DealDamageAction;
