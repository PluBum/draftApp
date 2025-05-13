import S from "./Header.module.scss";

const Header = () => {
  return (
    <div className={S.headerBlock}>
      <div className={S.logoBlock}></div>
      <div className={S.textBlock}>
        <span className={S.text}>Отдел информационных технологий</span>
      </div>
    </div>
  );
};

export default Header;
