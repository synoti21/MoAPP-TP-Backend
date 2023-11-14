import { Injectable } from '@nestjs/common';
import { CreateInteractionDto } from './dto/create-interaction.dto';
import { ResponseCode } from '../../common';
import { FamilyMemberException } from '../../common/exception/family-member.exception';
import { InjectRepository } from '@nestjs/typeorm';
import { FamilyMember, Interaction } from '../../infra/entities';
import { Repository } from 'typeorm';

@Injectable()
export class InteractionService {
  constructor(
    @InjectRepository(Interaction)
    private interactionRepository: Repository<Interaction>,
    @InjectRepository(FamilyMember)
    private familyMemberRepository: Repository<FamilyMember>,
  ) {}
  async createInteraction(createInteractionDto: CreateInteractionDto) {
    const dstFamilyMember = await this.familyMemberRepository.findOne({
      where: {id: createInteractionDto.dstMemberId},
    });
    const interaction: Interaction = Interaction.createInteraction(
        createInteractionDto.srcMemberId,
        dstFamilyMember,
        createInteractionDto.interactionType,
    );
    const savedInteraction = await this.interactionRepository.save(interaction);
    return savedInteraction.id;
  }

  sendInteraction(interactionId: number, dstFamilyMember: FamilyMember) {
    //using fcm
  }

  async findAllInteractions(familyMemberId: number) {
    await this.validateFamilyMember(familyMemberId);
    return await this.interactionRepository.find({
      where: { dstMember: { id: familyMemberId } },
    });
  }

  async validateFamilyMember(familyMemberId: number) {
    const familyMember = await this.familyMemberRepository.findOne({
      where: { id: familyMemberId },
    });
    if (!familyMember) {
      throw new FamilyMemberException(ResponseCode.FAMILY_MEMBER_NOT_FOUND);
    }
    return familyMember;
  }
}
