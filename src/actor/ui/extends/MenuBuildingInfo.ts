import { Ui } from "../../../ui";
import { Building } from "../../base/building";
import { CannonBase } from "../../base/cannon";
import { MenuImageButton } from "../MenuImageButton";
import { MenuText } from "../MenuText";
import { MenuWindow } from "../MenuWindow";

export class MenuBuildingInfo {
    onClose: () => void;

    setCloseFn(onClose: () => void) {
        this.onClose = onClose;
    }

    destroy() {
        throw "MenuBuildingInfo.destroy should be overload";
    }
}
