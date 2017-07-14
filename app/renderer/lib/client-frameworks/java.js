import Framework from './framework';

class JavaFramework extends Framework {

  get language () {
    return "java";
  }

  wrapWithBoilerplate (code) {
    let [pkg, cls] = (() => {
      switch (this.caps.platformName.toLowerCase()) {
        case "ios": return ["ios", "IOSDriver"];
        case "android": return ["android", "AndroidDriver"];
        default: throw new Error(`Appium Desktop java code generation doesn't understand platformName '${this.caps.platformName}'`);
      }
    })();
    let capStr = this.indent(Object.keys(this.caps).map((k) => {
      return `desiredCapabilities.setCapability(${JSON.stringify(k)}, ${JSON.stringify(this.caps[k])});`;
    }).join("\n"), 4);
    return `import io.appium.java_client.MobileElement;
import io.appium.java_client.${pkg}.${cls};
import junit.framework.TestCase;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import java.net.MalformedURLException;
import java.net.URL;
import org.openqa.selenium.remote.DesiredCapabilities;

public class SampleTest {

  private ${cls} driver;

  @Before
  public void setUp() throws MalformedURLException {
    DesiredCapabilities desiredCapabilities = new DesiredCapabilities();
${capStr}

    URL remoteUrl = new URL("http://${this.host}:${this.port}/wd/hub");

    driver = new ${cls}(remoteUrl, desiredCapabilities);
  }

  @Test
  public void sampleTest() {
${this.indent(code, 4)}
  }

  @After
  public void tearDown() {
    driver.quit();
  }
}
`;
  }

  codeFor_findAndAssign (strategy, locator, localVar, isArray) {
    let suffixMap = {
      xpath: "XPath",
      'accessibility id': 'AccessibilityId',
      'id': 'Id',
    };
    if (!suffixMap[strategy]) {
      throw new Error(`Strategy ${strategy} can't be code-gened`);
    }
    if (isArray) {
      return `List<MobileElement> ${localVar} = (MobileElement) driver.findElementsBy${suffixMap[strategy]}(${JSON.stringify(locator)});`;
    } else {
      return `MobileElement ${localVar} = (MobileElement) driver.findElementBy${suffixMap[strategy]}(${JSON.stringify(locator)});`;
    }
  }

  getVarName (varName, varIndex) {
    if (varIndex || varIndex === 0) {
      return `${varName}.get(varIndex)`;
    } 
    return varName;
  }

  codeFor_click (varName, varIndex) {
    return `${this.getVarName(varName, varIndex)}.click();`;
  }

  codeFor_clear (varName, varIndex) {
    return `${this.getVarName(varName, varIndex)}.clear();`;
  }

  codeFor_sendKeys (varName, varIndex, text) {
    return `${this.getVarName(varName, varIndex)}.sendKeys(${JSON.stringify(text)});`;
  }

  codeFor_back () {
    return `driver.navigate().back();`;
  }
}

JavaFramework.readableName = "Java - JUnit";

export default JavaFramework;
