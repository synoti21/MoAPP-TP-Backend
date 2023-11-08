import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { PostService } from '../post';
import { CreatePostDto, UpdatePostDto } from '../post';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  //포스트 등록

  //포스트 수정

  //포스트 삭제

  //포스트 리스트 반환

}
