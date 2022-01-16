import argparse

def initialize():
    parser = argparse.ArgumentParser()
    parser.add_argument('--env', required=True, help='실행 환경을 입력해주세요.')
    parser.add_argument('--token', required=False, help='토큰을 입력해주세요')

    args = parser.parse_args()

    env = args.env
    token = args.token

    return {
        'env': env,
        'token': token,
    }