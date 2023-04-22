echo "Building Package starting..."

echo "Export libraries..."
echo -e "\
export { AppHostModule } from '@app/app-host';\n\
export { AppHostService } from '@app/app-host'\n;\
export { ArchiveModule } from '@app/archive';\n\
export { ArchiveService } from '@app/archive'\n;\
export { AwsConfigurationModule } from '@app/aws-configuration'\n;\
export { AwsConfigurationService } from '@app/aws-configuration'\n;\
export { AwsCoreModule } from '@app/aws-core'\n;\
export { AwsCoreService } from '@app/aws-core'\n;\
export { AwsEc2Module } from '@app/aws-ec2'\n;\
export { AwsEc2Service } from '@app/aws-ec2'\n;\
export { AwsS3Module } from '@app/aws-s3'\n;\
export { AwsS3Service } from '@app/aws-s3'\n;\
export { AwsStsModule } from '@app/aws-sts'\n;\
export { AwsStsService } from '@app/aws-sts'\n;\
export { BjsonModule } from '@app/bjson'\n;\
export { BjsonService } from '@app/bjson'\n;\
export { BootstrapModule } from '@app/bootstrap'\n;\
export { BootstrapService } from '@app/bootstrap'\n;\
export { ConfigurationModule } from '@app/configuration'\n;\
export { ConfigurationService } from '@app/configuration'\n;\
export { CoreModule } from '@app/core'\n;\
export { CoreService } from '@app/core'\n;\
export { CryptoModule } from '@app/crypto'\n;\
export { CryptoService } from '@app/crypto'\n;\
export { DateExModule } from '@app/date-ex'\n;\
export { DateExService } from '@app/date-ex'\n;\
export { DebugModule } from '@app/debug'\n;\
export { DebugService } from '@app/debug'\n;\
export { EmailModule } from '@app/email'\n;\
export { EmailService } from '@app/email'\n;\
export { FileGridfsModule } from '@app/file-gridfs'\n;\
export { FileGridfsService } from '@app/file-gridfs'\n;\
export { FilesModule } from '@app/files'\n;\
export { FilesService } from '@app/files'\n;\
export { HypercModule } from '@app/hyperc'\n;\
export { HypercService } from '@app/hyperc'\n;\
export { i18nModule } from '@app/i18n'\n;\
export { i18nService } from '@app/i18n'\n;\
export { JsonWebTokenModule } from '@app/json-web-token'\n;\
export { JsonWebTokenService } from '@app/json-web-token'\n;\
export { LocalPathModule } from '@app/localpath'\n;\
export { LocalPathService } from '@app/localpath'\n;\
export { PrivateKeysModule } from '@app/private-keys'\n;\
export { PrivateKeysService } from '@app/private-keys'\n;\
export { PropStringModule } from '@app/prop-string'\n;\
export { PropStringService } from '@app/prop-string'\n;\
export { RandomModule } from '@app/random'\n;\
export { RandomService } from '@app/random'\n;\
export { SchedulesModule } from '@app/schedules'\n;\
export { SchedulesService } from '@app/schedules'\n;\
export { SimilarityFilterModule } from '@app/similarity-filter'\n;\
export { SimilarityFilterService } from '@app/similarity-filter'\n;\
export { StringExModule } from '@app/string-ex'\n;\
export { StringExService } from '@app/string-ex'\n;\
export { UsersModule } from '@app/users'\n;\
export { UsersService } from '@app/users'\n;\
export { ValidatorRegexpModule } from '@app/validator-regexp'\n;\
export { ValidatorRegexpService } from '@app/validator-regexp';\
" >> index.ts

echo "Building package..."
yarn build

echo "Cleaning up..."
rm -rf dist/src
rm index.ts

echo "Package built."
