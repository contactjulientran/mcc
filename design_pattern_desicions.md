## design_pattern_desicions.md
Ce document doit expliquer les modèles de conception choisis et la raison du choix. Ce lien peut vous aider https://fravoll.github.io/solidity-patterns/. 

### Smart Contract MCCUserToken

#### [Guard Check](https://fravoll.github.io/solidity-patterns/guard_check.html)
Les paramètres d'entrée suivants sont vérifiés:
* `msg.sender` est bien le `owner du contrat` pour les fonctions qui le requiert
* un email n'a pas déjà utilisé lors de la création d'un utilisateur
* un id d'utilisateur existe bien

#### [Checks Effects Interactions](https://fravoll.github.io/solidity-patterns/checks_effects_interactions.html)
Le Smart Contract hérite du Smart Contract d'OpenZepellin ERC721.
La fonction de création d'un utilisateur utilise la fonction `_safeMint` de ce dernier. S'agissant d'un appel externe, il est impératif d'appeler cette fonction en dernier afin d'éviter une attaque par [ré-entrance](https://docs.soliditylang.org/en/latest/security-considerations.html#re-entrancy).