import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm"

@Entity({ name: "earned_memes" })
export class EarnedMemeEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    memeId: number

    @Column()
    userId: number

    @Column({ default: 0 })
    earnedTimes: number

    @CreateDateColumn()
    createdAt: Date
    
    @UpdateDateColumn()
    updatedAt: Date

    static create(earnedmeme: Omit<EarnedMemeEntity, 'id' | 'createdAt' | 'updatedAt' | 'earnedTimes'>) : EarnedMemeEntity {
        const entity = new EarnedMemeEntity()
        entity.memeId = earnedmeme.memeId;
        entity.userId = earnedmeme.userId;
        entity.earnedTimes = 1;
        return entity;
    }
}