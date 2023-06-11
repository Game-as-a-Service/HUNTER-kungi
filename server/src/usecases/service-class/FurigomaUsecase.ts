import { Inject, Injectable } from '@nestjs/common';
import EventBus from '../EventBus';
import IRepository from '../Repository';
import Gungi from '../../domain/Gungi';
import { Event } from '../../domain/events/Event';
import Presenter from '../Presenter';
export class FurigomaUsecaseInput {
  gungiId: string;
  playerId: string;

  constructor(gungiId: string, playerId: string) {
    this.gungiId = gungiId;
    this.playerId = playerId;
  }
}
@Injectable()
export default class FurigomaUsecase {
  constructor(
    @Inject('GungiRepository')
    private _gungiRepository: IRepository<Gungi>,
    @Inject('EventBus')
    private _eventBus: EventBus,
  ) {}

  async execute(input: FurigomaUsecaseInput, presenter: Presenter) {
    const gungi = await this._gungiRepository.findById(input.gungiId);
    const player = gungi.getPlayer(input.playerId);
    const opponent = gungi.getOpponent(player);
    // furigoma - roll five hei to determine who goes first
    const event: Event[] = await gungi.furigoma(player, opponent);
    await this._gungiRepository.save(gungi);
    this._eventBus.broadcast(event);
    return presenter.present(event);
  }
}
