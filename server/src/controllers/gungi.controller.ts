import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Res,
} from '@nestjs/common';
import FurigomaUsecase from '../usecases/furigoma-usecase';
import SurrenderUsecase, {
  SurrenderRequest,
} from '../usecases/surrender-usecase';
import SurrenderPresenter from '../frameworks/presenter/SurrenderPresenter';

@Controller()
export default class GungiController {
  constructor(
    private _furigomaUsecase: FurigomaUsecase,
    private _surrenderUsecase: SurrenderUsecase,
  ) {}

  @Post('/gungi/:id/furigoma')
  async furigoma(@Param('id') id: string, @Body() body: any) {
    const response = await this._furigomaUsecase.execute();
    return response;
  }

  @Post('/gungi/:id/surrender')
  async surrender(
    @Param('id') id: string,
    @Body() body: { playerId: string },
    @Res() res,
  ) {
    const request: SurrenderRequest = {
      gungiId: id,
      playerId: body.playerId,
    };

    const presenter = new SurrenderPresenter();
    const response = await this._surrenderUsecase.execute(request, presenter);

    return res.status(HttpStatus.OK).send(response);
  }
}
