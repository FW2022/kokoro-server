export class FindAllArgDto {
    skip?: number = 0;
    take?: number = 9;
    hashtag?: string;
    hashtagEqual?: string;
    name?: string;
    keyword?: string;
    userID?: string;
}
