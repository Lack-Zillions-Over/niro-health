const translation = {
  middlewares: {
    authorization: {
      exception:
        'Acesso não autorizado a este recurso. Chave inválida ou não fornecida',
    },
  },
  'private-keys': {
    repository: {
      private_key_already_exists:
        'Chave privada já existe com o mesmo valor $1 $2',
      private_key_not_found: 'Chave privada não encontrada com o valor $1 $2',
      invalid_secret: 'Senha inválida para a chave privada',
      field_in_use: 'O campo($1) já existe com o mesmo valor $2',
    },
  },
  files: {
    controller: {
      file_not_supported:
        'Este tipo de arquivo não é suportado. Tipos suportados: $1',
    },
  },
  users: {
    repository: {
      session_inactive:
        'Esta sessão está inativa. Você excedeu o limite de tentativas para login. Por favor, aguarde 20 minutos e tente novamente.',
      user_already_exists: 'Usuário com $1($2) já existe',
      field_in_use: 'O campo $1 já existe com o mesmo valor $2',
      user_not_exists: 'Usuário com $1($2) não existe',
      user_account_not_activate: 'Conta de usuário não ativada',
      password_incorrect: 'Senha incorreta',
      user_is_banned: 'Usuário está banido',
      user_session_exceed_limit:
        'Usuário com $1($2) já excedeu o limite($3) de sessões permitidas',
      user_session_ipAddress_not_allowed:
        'Usuário não permitido para login a partir deste endereço IP($1)',
      user_session_ipAddress_is_blocked:
        'Usuário não permitido para login a partir deste endereço IP($1) porque está bloqueado',
      user_session_device_not_allowed:
        'Usuário não permitido para login a partir deste dispositivo($1)',
      users_not_connected: 'Usuários com $1($2) não conectados',
      session_canceled: 'Sessão cancelada',
      session_geoip_not_equal_stored:
        'Sessão não permitida porque está em uma localização diferente',
      user_not_connected: 'Usuário com $1($2) não conectado',
      session_access_token_is_not_same_ip_address:
        'Sessão não permitida porque o endereço IP é diferente do histórico',
      session_device_is_not_same_in_history:
        'Sessão não permitida porque o dispositivo é diferente do histórico',
      session_token_revalidate_is_invalid: 'Sessão token revalidate é inválido',
      session_token_revalidate_ipAddress_is_not_stored:
        'Sessão token revalidate IP address is not stored',
      session_access_token_expired: 'Sessão access token expirou',
    },
  },
};

export default translation;
