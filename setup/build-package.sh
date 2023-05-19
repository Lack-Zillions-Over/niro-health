echo "Building Package starting..."

echo "Export libraries..."

echo "Export App Host (Interface, Module, Service)"
echo -e "\
export { IAppHostService } from '@app/app-host';\n\
export { AppHostModule } from '@app/app-host';\n\
export { AppHostService } from '@app/app-host';\n\
" >> index.ts

echo "Export Archive (Interface, Module, Service)"
echo -e "\
export { IArchiveService } from '@app/archive';\n\
export { ArchiveModule } from '@app/archive';\n\
export { ArchiveService } from '@app/archive';\n\
" >> index.ts

echo "Export AWS Configuration (Interface, Module, Service)"
echo -e "\
export { IAwsConfigurationService } from '@app/aws-configuration';\n\
export { AwsConfigurationModule } from '@app/aws-configuration';\n\
export { AwsConfigurationService } from '@app/aws-configuration';\n\
" >> index.ts

echo "Export AWS Core (Interface, Module, Service)"
echo -e "\
export { IAwsCoreServiceImpl } from '@app/aws-core';\n\
export { AwsCoreModule } from '@app/aws-core';\n\
export { AwsCoreService } from '@app/aws-core';\n\
" >> index.ts

echo "Export AWS EC2 (Interface, Module, Service)"
echo -e "\
export { IAwsEc2Service } from '@app/aws-ec2';\n\
export { AwsEc2Module } from '@app/aws-ec2';\n\
export { AwsEc2Service } from '@app/aws-ec2';\n\
" >> index.ts

echo "Export AWS S3 (Interface, Module, Service)"
echo -e "\
export { IAwsS3Service } from '@app/aws-s3';\n\
export { AwsS3Module } from '@app/aws-s3';\n\
export { AwsS3Service } from '@app/aws-s3';\n\
" >> index.ts

echo "Export AWS STS (Interface, Module, Service)"
echo -e "\
export { IAwsStsService } from '@app/aws-sts';\n\
export { AwsStsModule } from '@app/aws-sts';\n\
export { AwsStsService } from '@app/aws-sts';\n\
" >> index.ts

echo "Export BJSON (Interface, Module, Service)"
echo -e "\
export { IBjsonService } from '@app/bjson';\n\
export { BjsonModule } from '@app/bjson';\n\
export { BjsonService } from '@app/bjson';\n\
" >> index.ts

echo "Export Configuration (Interface, Module, Service)"
echo -e "\
export { IConfigurationService } from '@app/configuration';\n\
export { ConfigurationModule } from '@app/configuration';\n\
export { ConfigurationService } from '@app/configuration';\n\
" >> index.ts

echo "Export Core (Essentials Resources)"
echo -e "\
export { queuePool } from '@app/core';\n\
export { getBullBoardQueues } from '@app/core';\n\
export { RecursivePartial } from '@app/core';\n\
export { ICoreDatabaseContract } from '@app/core';\n\
export { CoreDatabaseContract } from '@app/core';\n\
export { ICoreEntityContract } from '@app/core';\n\
export { CoreEntityContract } from '@app/core';\n\
export { ICoreRepositoryContract } from '@app/core';\n\
export { CoreRepositoryContract } from '@app/core';\n\
export { AuthorizationMiddleware } from '@app/core';\n\
export { JoiValidationPipe } from '@app/core';\n\
export { IMongoDBService } from '@app/core';\n\
export { MongoDBModule } from '@app/core';\n\
export { MongoDBService } from '@app/core';\n\
export { IPrismaService } from '@app/core';\n\
export { PrismaModule } from '@app/core';\n\
export { PrismaService } from '@app/core';\n\
export { IRedisService } from '@app/core';\n\
export { RedisModule } from '@app/core';\n\
export { RedisService } from '@app/core';\n\
export { ISqliteService } from '@app/core';\n\
export { SqliteModule } from '@app/core';\n\
export { SqliteService } from '@app/core';\n\
export { GeoIP } from '@app/core';\n\
" >> index.ts

echo "Export Crypto (Interface, Module, Service)"
echo -e "\
export { ICryptoService } from '@app/crypto';\n\
export { CryptoModule } from '@app/crypto';\n\
export { CryptoService } from '@app/crypto';\n\
" >> index.ts

echo "Export DateEx (Interface, Module, Service)"
echo -e "\
export { IDateExService } from '@app/date-ex';\n\
export { DateExModule } from '@app/date-ex';\n\
export { DateExService } from '@app/date-ex';\n\
" >> index.ts

echo "Export Debug (Interface, Module, Service)"
echo -e "\
export { IDebugService } from '@app/debug';\n\
export { DebugModule } from '@app/debug';\n\
export { DebugService } from '@app/debug';\n\
" >> index.ts

echo "Export Email (Interface, Module, Service)"
echo -e "\
export { IEmailService } from '@app/email';\n\
export { EmailModule } from '@app/email';\n\
export { EmailService } from '@app/email';\n\
" >> index.ts

echo "Export FileGridFS (Interface, Module, Service)"
echo -e "\
export { IFileGridfsService } from '@app/file-gridfs';\n\
export { FileGridfsModule } from '@app/file-gridfs';\n\
export { FileGridfsService } from '@app/file-gridfs';\n\
" >> index.ts

echo "Export Hyperc (Interface, Module, Service)"
echo -e "\
export { IHypercService } from '@app/hyperc';\n\
export { HypercModule } from '@app/hyperc';\n\
export { HypercService } from '@app/hyperc';\n\
" >> index.ts

echo "Export i18n (Interface, Module, Service)"
echo -e "\
export { Ii18nService } from '@app/i18n';\n\
export { i18nModule } from '@app/i18n';\n\
export { i18nService } from '@app/i18n';\n\
" >> index.ts

echo "Export Json Web Token (Interface, Module, Service)"
echo -e "\
export { IJsonWebTokenService } from '@app/json-web-token';\n\
export { JsonWebTokenModule } from '@app/json-web-token';\n\
export { JsonWebTokenService } from '@app/json-web-token';\n\
" >> index.ts

echo "Export PropString (Interface, Module, Service)"
echo -e "\
export { IPropStringService } from '@app/prop-string';\n\
export { PropStringModule } from '@app/prop-string';\n\
export { PropStringService } from '@app/prop-string';\n\
" >> index.ts

echo "Export Random (Interface, Module, Service)"
echo -e "\
export { IRandomService } from '@app/random';\n\
export { RandomModule } from '@app/random';\n\
export { RandomService } from '@app/random';\n\
" >> index.ts

echo "Export Similarity Filter (Interface, Module, Service)"
echo -e "\
export { ISimilarityFilterService, Type as SimilarityFilterType } from '@app/similarity-filter';\n\
export { SimilarityFilterModule } from '@app/similarity-filter';\n\
export { SimilarityFilterService } from '@app/similarity-filter';\n\
" >> index.ts

echo "Export StringEx (Interface, Module, Service)"
echo -e "\
export { IStringExService } from '@app/string-ex';\n\
export { StringExModule } from '@app/string-ex';\n\
export { StringExService } from '@app/string-ex';\n\
" >> index.ts

echo "Export Validator Regexp (Interface, Module, Service)"
echo -e "\
export { IValidatorRegexpService } from '@app/validator-regexp';\n\
export { ValidatorRegexpModule } from '@app/validator-regexp';\n\
export { ValidatorRegexpService } from '@app/validator-regexp';\n\
" >> index.ts

echo "Building package..."
yarn build

echo "Cleaning up..."
rm -rf dist/src
rm index.ts

echo "Package built."
