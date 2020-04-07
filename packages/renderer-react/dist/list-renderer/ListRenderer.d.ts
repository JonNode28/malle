declare type Props = {
    config: MalleModelConfig;
};
declare type MalleModelConfig = {
    id: string;
    name: string;
    description?: string;
    properties: Array<MallePropertyConfig>;
};
declare type MallePropertyConfig = {
    id: string;
    name: string;
    description: string;
    type: string;
    validations: Array<MalleValidationConfig>;
};
declare type MalleValidationConfig = {
    errorMessage: string;
    options: any;
};
declare function ListRenderer({ config }: Props): any;
export default ListRenderer;
