import { Injectable } from '@nestjs/common';
import { CreateFamilyMemberDto, UpdateFamilyMemberDto } from './dto';
import { Family, FamilyMember, User } from '../../infra/entities';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ResponseCode } from '../../common';
import { UserException } from '../../common/exception/user.exception';
import { ResponseFamilyDto } from '../family';
import { FamilyMemberException } from '../../common/exception/family-member.exception';
import { FamilyException } from '../../common/exception/family.exception';

@Injectable()
export class FamilyMemberService {
  constructor(
    @InjectRepository(FamilyMember)
    private familyMemberRepository: Repository<FamilyMember>,
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Family) private familyRepository: Repository<Family>,
  ) {}
  async createFamilyMember(
    createFamilyMemberDto: CreateFamilyMemberDto,
  ): Promise<number> {
    const user = await this.validateUser(createFamilyMemberDto.userId);
    const family = await this.validateFamily(createFamilyMemberDto.familyId);

    const familyMember: FamilyMember = FamilyMember.createFamilyMember(
      createFamilyMemberDto.role,
      family,
      user,
    );
    const savedMember = await this.familyMemberRepository.save(familyMember);
    return savedMember.id;
  }

  async updateFamilyMember(
    updateFamilyMemberDto: UpdateFamilyMemberDto,
  ): Promise<void> {
    const familyMember = await this.validateFamilyMember(
      updateFamilyMemberDto.familyMemberId,
    );
    familyMember.role = updateFamilyMemberDto.role;
    await this.familyMemberRepository.save(familyMember);
  }

  async deleteFamilyMember(familyMemberId: number) {
    await this.validateFamilyMember(familyMemberId);
    await this.familyMemberRepository.delete(familyMemberId);
  }

  async findFamilyByMemberId(
    familyMemberId: number,
  ): Promise<ResponseFamilyDto> {
    const familyMember = await this.validateFamilyMember(familyMemberId);
    return ResponseFamilyDto.from(familyMember.family);
  }

  async validateUser(userId: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });
    if (!user) {
      throw new UserException(ResponseCode.USER_NOT_FOUND);
    }
    return user;
  }

  async validateFamily(familyId: number): Promise<Family> {
    const family = await this.familyRepository.findOne({
      where: { id: familyId },
    });
    if (!family) {
      throw new FamilyException(ResponseCode.FAMILY_NOT_FOUND);
    }
    return family;
  }

  async validateFamilyMember(familyMemberId: number): Promise<FamilyMember> {
    const familyMember = await this.familyMemberRepository.findOne({
      where: { id: familyMemberId },
    });
    if (!familyMember) {
      throw new FamilyMemberException(ResponseCode.FAMILY_MEMBER_NOT_FOUND);
    }
    return familyMember;
  }
}