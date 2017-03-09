# 스한스 웹사이트

[스포카 한 산스 저장소](https://github.com/spoqa/spoqa-han-sans)의 웹사이트 저장소입니다.

## 왜 저장소가 따로 있어요?
[META-726](https://i.spoqa.com/browse/META-726), [META-741](https://i.spoqa.com/browse/META-741) 참고

## 로컬에서 띄워보는 법
`_config.yml` 파일의 `base_path` 설정을 `http://localhost:5909/`로 바꿔놓고 테스트합니다.
```
git submodule update --init --recursive
jekyll serve -p 5909
```

## 어떻게 코드를 고치고 배포해요?
레거시 url을 유지하기 위해 스포카 한 산스 저장소의 `gh-pages` 브랜치에 jekyll 빌드 결과물을 부어넣고 커밋 및 푸시합니다.

이 때는 `_config.yml` 파일의 `base_path` 설정이 `https://spoqa.github.io/spoqa-han-sans/` 이어야 합니다.
```
# gh-pages 체크아웃
pushd ./spoqa-han-sans
git checkout gh-pages
popd

# 지킬 빌드 및 커밋&푸시
jekyll build --destination ./spoqa-han-sans
pushd ./spoqa-han-sans
git add .
git commit
git push origin gh-pages
popd

# 현 저장소 커밋&푸시
git add .
git commit
git push origin <브랜치명>
```
