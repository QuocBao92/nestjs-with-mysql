import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';


@Entity({ name: 'mock_ohi_cache' })
export class OhiCache {

    /**
     * id
     */
    @PrimaryGeneratedColumn()
    public id: number;

    /**
     * api_name
     */
    @Column({ name: 'api_name', type: 'varchar', length: 255, nullable: false })
    // tslint:disable-next-line:variable-name
    public api_name: string;

    /**
     * parameters
     */
    @Column({ name: 'parameters', type: 'text', nullable: false })
    public parameters: string;

    /**
     * respone_data
     */
    @Column({ name: 'respone_data', type: 'longtext' })
    // tslint:disable-next-line:variable-name
    public respone_data: string;

    // @Column({ name: 'acess_token', type: 'varchar', length: 255, nullable: true })
    // // tslint:disable-next-line:variable-name
    // public acess_token: string;
}
