import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseInterceptors,
    UploadedFiles,
    UseGuards,
    Request,
    Query,
} from "@nestjs/common";
import { FilesInterceptor } from "@nestjs/platform-express";
import { BoardService } from "./board.service";
import { CreateBoardDto } from "./dto/create-board.dto";
import { UpdateBoardDto } from "./dto/update-board.dto";
import multer from "multer";
import { JwtAuthGuard } from "../auth/guard/jwt-auth.guard";
import fakerStatic from "faker";
import { User } from "../user/entities/user.entity";
import { FindAllArgDto } from "./dto/board.dto";
import { Board } from "./entities/board.entity";

@Controller("api/board")
export class BoardController {
    constructor(private readonly boardService: BoardService) {}

    @Post()
    @UseGuards(JwtAuthGuard)
    create(@Request() req, @Body() createBoardDto: CreateBoardDto) {
        try {
            const user: User = req.user;
            return this.boardService.create(createBoardDto, user.id);
        } catch (err) {
            console.log(err);
            throw err;
        }
    }

    @Post("create")
    createByGuest(@Body() createBoardDto: CreateBoardDto) {
        try {
            return this.boardService.create(createBoardDto);
        } catch (err) {
            console.log(err);
            throw err;
        }
    }

    @Get()
    findAll(@Query() query?: FindAllArgDto): Promise<[Board[], number]> {
        return this.boardService.findAll({ ...query });
    }

    @Post("upload-images")
    @UseInterceptors(
        FilesInterceptor("files", 5, {
            dest: "./public/",
            storage: multer.diskStorage({
                filename: function (req, file, cb) {
                    cb(
                        null,
                        `${new Date().getTime()}_${fakerStatic.datatype.number({
                            min: 0,
                            max: 99999999,
                            precision: 8,
                        })}.${
                            file.originalname.split(".")[
                                file.originalname.split(".").length - 1
                            ]
                        }`
                    );
                },
                destination: function (req, file, cb) {
                    cb(null, "./public/");
                },
            }),
        })
    )
    uploadImage(@UploadedFiles() files: Array<Express.Multer.File>) {
        try {
            console.log(files);

            return {
                result: true,
                files,
            };
        } catch (err) {
            console.log(err);
        }
    }

    @Get(":id")
    findOne(@Param("id") id: string) {
        return this.boardService.findOne(id);
    }

    @Patch(":id")
    update(@Param("id") id: string, @Body() updateBoardDto: UpdateBoardDto) {
        return this.boardService.update(id, updateBoardDto);
    }

    @Delete(":id")
    remove(@Param("id") id: string) {
        return this.boardService.remove(id);
    }
}
