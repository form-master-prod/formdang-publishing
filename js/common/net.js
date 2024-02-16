/**
 * 네트워크 js
 */

// REST 상수
const G = "GET" // GET 상수
const P = "POST"; // POST 상수
const SP_PFX = "/api/sp"; // 스프링 API prefix (해당 prefix에 따라 nginx에서 revers proxy 처리)
const J_CT = "application/json; charset=utf-8";
const DF_CT = "application/x-www-form-urlencoded; charset=utf-8";

// Error Code
const REFUSE_ALREADY_START_FORM = '30007';
const REFUSE_ALREADY_DELETE_FORM = '30008';
const REFUSE_ALREADY_END_FORM = '30009';

function ccatPfx(u) { return SP_PFX + u } // 스프링 API prefix 생성 함수
function gt() { return { 'Authorization': `Bearer ${window.localStorage.getItem(ACCESS_TOKEN)}` } } // 헤더 토큰 적용 함수

function fla(d) { // 폼 리스트 조회
    return ajaxForm(getApiURL(ccatPfx('/form/list/find')), d, G, gt(), DF_CT, true , true)
}

function find_form_api(fid) {
    return ajaxForm(getApiURL(ccatPfx(`/form/detail/${fid}/find`)), null, G, gt(), DF_CT, true, true)
}

function register_form_api(d) { // 폼 제출
    return ajaxForm(getApiURL(ccatPfx('/form/submit')), JSON.stringify(d), P, gt(), J_CT, false, true)
}

function update_form_api(d, fid) { // 폼 업데이트
    return ajaxForm(getApiURL(ccatPfx(`/form/${fid}/update`)), JSON.stringify(d), P, gt(), J_CT, false, true)
}

function upload_file_list_api(d, fid) { // 파일 업로드
    return ajaxForm(getApiURL(ccatPfx(`/public/file/list/upload/${fid}`)), d, P, gt(), false, false, true);
}

function upload_profile_api(d) { // 프로필 업로드
    return ajaxForm(getApiURL(ccatPfx(`/public/file/upload/profile`)), d, P, gt(), false, false, true);
}

function uva() { // 토큰 유효성 검사
    return ajaxForm(getApiURL(ccatPfx('/admin/validate')), {}, G, gt(), DF_CT, true, true)
}

function uva2() { // 토큰 유효성 검사
    return ajaxForm(getApiURL(ccatPfx('/admin/validate')), {}, G, gt(), DF_CT, true, false)
}

async function ajaxForm(u, d, m, h, c, p, f) {
    return await $.ajax({
        url : u,
        data: d,
        method : m,
        headers: h,
        processData: p,
        contentType: c,
        success: (r) => {
            if (!isProduction()) console.log(r) // 개발 환경 콘솔 처리
            return r;
        },
        error:function(e){
            if (!isProduction()) console.log(e) // 개발 환경 콘솔 처리
            if (f) {
                return isUnAuthorized(e);
            } else {
                return null;
            }
        }
    });
}