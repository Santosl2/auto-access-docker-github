# 🐳 Docker - Instruções de Deploy

## Pré-requisitos

- Docker instalado
- Docker Compose instalado (opcional, mas recomendado)
- Arquivo `.env` configurado com todas as variáveis necessárias

## Como Usar

### Opção 1: Usando Docker Compose (Recomendado)

1. **Configure as variáveis de ambiente:**
   ```bash
   cp .env.example .env
   # Edite o arquivo .env com suas credenciais
   ```

2. **Build e inicie o container:**
   ```bash
   docker-compose up -d
   ```

3. **Acesse a aplicação:**
   ```
   http://localhost:3000
   ```

4. **Ver logs:**
   ```bash
   docker-compose logs -f
   ```

5. **Parar o container:**
   ```bash
   docker-compose down
   ```

### Opção 2: Usando Docker diretamente

1. **Build da imagem:**
   ```bash
   docker build -t auto-access-app .
   ```

2. **Executar o container:**
   ```bash
   docker run -d \
     -p 3000:3000 \
     --env-file .env \
     --name auto-access \
     --restart unless-stopped \
     auto-access-app
   ```

3. **Ver logs:**
   ```bash
   docker logs -f auto-access
   ```

4. **Parar o container:**
   ```bash
   docker stop auto-access
   docker rm auto-access
   ```

## Comandos Úteis

### Rebuild da aplicação
```bash
docker-compose up -d --build
```

### Acessar o shell do container
```bash
docker exec -it auto-access sh
```

### Ver uso de recursos
```bash
docker stats auto-access
```

### Limpar imagens antigas
```bash
docker image prune -a
```

## Deploy em Produção

### Usando Docker Hub

1. **Login no Docker Hub:**
   ```bash
   docker login
   ```

2. **Tag da imagem:**
   ```bash
   docker tag auto-access-app seu-usuario/auto-access:latest
   ```

3. **Push para o Docker Hub:**
   ```bash
   docker push seu-usuario/auto-access:latest
   ```

4. **No servidor de produção:**
   ```bash
   docker pull seu-usuario/auto-access:latest
   docker run -d \
     -p 3000:3000 \
     --env-file .env \
     --name auto-access \
     --restart unless-stopped \
     seu-usuario/auto-access:latest
   ```

### Usando registro privado

Se você preferir usar um registro privado como GitHub Container Registry:

```bash
# Login
echo $GITHUB_TOKEN | docker login ghcr.io -u USERNAME --password-stdin

# Tag
docker tag auto-access-app ghcr.io/USERNAME/auto-access:latest

# Push
docker push ghcr.io/USERNAME/auto-access:latest
```

## Variáveis de Ambiente Necessárias

Certifique-se de configurar todas estas variáveis no arquivo `.env`:

- `NEXT_PUBLIC_SUPABASE_URL` - URL do seu projeto Supabase
- `SUPABASE_ANON_KEY` - Chave anônima do Supabase
- `GITHUB_TOKEN` - Token de acesso pessoal do GitHub
- `GITHUB_REPO_OWNER` - Seu username do GitHub
- `GITHUB_REPO_NAME` - Nome do repositório privado
- `DOCKER_HUB_USERNAME` - Seu username do Docker Hub
- `DOCKER_HUB_TOKEN` - Token de acesso do Docker Hub
- `DOCKER_HUB_REPO` - Nome do repositório Docker
- `RESEND_API_KEY` - Chave API do Resend
- `FROM_EMAIL` - Email remetente configurado no Resend

## Troubleshooting

### Container não inicia
```bash
# Ver logs de erro
docker logs auto-access

# Verificar se a porta 3000 está disponível
lsof -i :3000
```

### Problemas com variáveis de ambiente
```bash
# Verificar variáveis dentro do container
docker exec auto-access env
```

### Rebuild forçado
```bash
# Remover container e imagem
docker stop auto-access
docker rm auto-access
docker rmi auto-access-app

# Rebuild sem cache
docker build --no-cache -t auto-access-app .
```

## Estrutura do Dockerfile

O Dockerfile utiliza multi-stage build para otimização:

1. **base** - Configuração base com Node.js e pnpm
2. **deps** - Instalação de dependências
3. **builder** - Build da aplicação Next.js
4. **runner** - Imagem final otimizada para produção

Isso resulta em uma imagem final menor e mais segura.
