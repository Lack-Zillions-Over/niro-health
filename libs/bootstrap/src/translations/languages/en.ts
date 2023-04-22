const translation = {
  middlewares: {
    authorization: {
      exception:
        'Unauthorized access to this resource. Invalid key or no provided',
    },
  },
  'private-keys': {
    repository: {
      private_key_already_exists:
        'Private key already exists with same $1 value $2',
      private_key_not_found: 'Private key not found with $1 value $2',
      invalid_secret: 'Invalid secret for this private key',
      field_in_use: 'The field($1) already exists with value $2',
    },
  },
  files: {
    controller: {
      file_not_supported:
        'this file type is not supported. Supported types: $1',
    },
  },
  users: {
    repository: {
      session_inactive:
        'This session is inactive. Your exceeded the attempts limit for login. Please, wait 20 minutes and try again.',
      user_already_exists: 'User already exists with same $1 value $2',
      field_in_use: 'The field already exists with same $1 value $2',
      user_not_exists: 'User not exists with $1 value $2',
      user_account_not_activate: 'User account not activated',
      password_incorrect: 'Password incorrect',
      user_is_banned: 'User is banned',
      user_session_exceed_limit:
        'User with $1($2) already exceeded the limit($3) of sessions allowed',
      user_session_ipAddress_not_allowed:
        'User not allowed to login from this IP($1) address',
      user_session_ipAddress_is_blocked:
        'User not allowed to login from this IP($1) address because it is blocked',
      user_session_device_not_allowed:
        'User not allowed to login from this device($1)',
      users_not_connected: 'Users with $1($2) not connected',
      session_canceled: 'Session is canceled',
      session_geoip_not_equal_stored:
        'Session not allowed because is different location',
      user_not_connected: 'User with $1($2) not connected',
      session_access_token_is_not_same_ip_address:
        'Session access token is not same IP address in history',
      session_device_is_not_same_in_history:
        'Session device is not same in history',
      session_token_revalidate_is_invalid:
        'Session token revalidate is invalid',
      session_token_revalidate_ipAddress_is_not_stored:
        'Session token revalidate IP address is not stored',
      session_access_token_expired: 'Session access token expired',
    },
  },
};

export default translation;
