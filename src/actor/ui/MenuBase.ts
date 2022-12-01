
export class MenuBase{
    constructor(){}

    destroy() {
        throw "this function should be overloaded";
    }
}

export class MenuBaseUpdatable extends MenuBase {

    update(cursorx: number, cursory: number){
        throw "MenuBaseUpdatable.update should be overload"
    }
}