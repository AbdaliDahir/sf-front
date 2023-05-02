import Act from "../Act";

export interface GetPUKCodeRequestDTO  extends Act{

    scs: string;

    iccid: string;

}
