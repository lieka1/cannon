import { Player } from "../player";
import { Actor } from "./base/actor";
import { CannonBase, CannonDefine } from "./base/cannon";

// snip cannon should stop working if player is not aroud for a long time

const SnipCannonConHandler = (e: Actor) => {};

// const SnipCannonDefine: CannonDefine = {
//     name: "snip",
//     texture: "snip",
//     onShot: SnipCannonConHandler,
//     levelDefine: [{ damage: 10, attackSpeed: 1000 }],
// };

// const createSnipCannon = (p: Player): CannonBase => {
//     return new CannonBase(p.scene, p.x, p.y, SnipCannonDefine);
// };

// export default {
//     createSnipCannon,
// };
