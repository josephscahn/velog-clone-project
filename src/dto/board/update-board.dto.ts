import { PartialType } from "@nestjs/mapped-types";
import { CreateBoard } from "./create-board.dto";

export class UpdateBoard extends PartialType(CreateBoard){
}